import fetch from "node-fetch";
import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";
import type { SendFolioReportCsvServiceInterface } from "../../domain/services/send-folio-report-csv-service.interface";
import { UserModel } from "../../../user/infrastructure/persistence/schema/user.schema";

type SendFolioReportCsvDto = {
  email: string;
  folio?: string;
  seller_name?: string;
  no_quote?: number;
  customer?: string;
  seller_userid?: string;
  start_date?: string | Date;
  end_date?: string | Date;
  supplier?: string;
};

export class SendFolioReportCsvService
  implements SendFolioReportCsvServiceInterface
{
  private readonly mailerApiKey: string =
    process.env.MAILERSEND_API_KEY ??
    "mlsn.7c29264e4bf8175dac33f1c67765ddfb9a63363316c13df1403b8247afa8a189";

  private readonly senderEmail: string =
    process.env.MAILERSEND_FROM_EMAIL ?? "ventas@timetrekcourriers.com";

  private readonly senderName: string =
    process.env.MAILERSEND_FROM_NAME ?? "Timetrek";

  constructor(private readonly folioRepository: FolioRepositoryInterface) {}

  async run(data: SendFolioReportCsvDto): Promise<{
    success: boolean;
    message: string;
    total: number;
  }> {
    if (!data?.email) {
      throw new Error("email is required");
    }

    const rows = await this.folioRepository.findAllForReport({
      folio: data.folio,
      seller_name: data.seller_name,
      no_quote: data.no_quote,
      customer: data.customer,
      seller_userid: data.seller_userid,
      start_date: data.start_date,
      end_date: data.end_date,
      supplier: data.supplier,
    });

    const sellers = await this.getSellers();
    const csv = this.buildCsv(rows, sellers);
    await this.sendCsvByEmail(data.email, csv);

    return {
      success: true,
      message: "CSV sent successfully",
      total: rows.length,
    };
  }

  private async getSellers(): Promise<
    Array<{
      _id: string;
      full_name: string;
      commission: number;
      type_commission: "percentage" | "amount";
    }>
  > {
    const sellers = await UserModel.find(
      {
        deleted: false,
        role: { $regex: "^seller$", $options: "i" },
      },
      {
        _id: 1,
        full_name: 1,
        commission: 1,
        type_commission: 1,
      },
    )
      .sort({ full_name: 1 })
      .lean()
      .exec();

    return sellers.map((seller: any) => ({
      _id: String(seller._id),
      full_name: seller.full_name ?? "SIN NOMBRE",
      commission: Number(seller.commission ?? 0),
      type_commission: (seller.type_commission ?? "percentage") as
        | "percentage"
        | "amount",
    }));
  }

  private buildCsv(
    rows: any[],
    sellers: Array<{
      _id: string;
      full_name: string;
      commission: number;
      type_commission: "percentage" | "amount";
    }>,
  ): string {
    const baseHeaders = [
      "FOLIO",
      "FECHA CREACION",
      "COSTO",
      "VENTA",
      "COSTOS SIN IVA",
      "VENTAS SIN IVA",
      "GP",
    ];

    const sellerHeaders = sellers.map(
      (seller) => `COMISION - ${seller.full_name.toUpperCase()}`,
    );
    const headers = [...baseHeaders, ...sellerHeaders, "ESTATUS"];

    const csvRows = rows.map((folio: any) => {
      const activeServiceCost = Array.isArray(folio?.service_cost)
        ? folio.service_cost.find((cost: any) => cost?.active)
        : null;

      const activeQuote = Array.isArray(activeServiceCost?.quotes)
        ? activeServiceCost.quotes.find((quote: any) => quote?.active) ??
          activeServiceCost.quotes[0]
        : null;

      const costo = Number(activeServiceCost?.total ?? 0);
      const venta = Number(activeQuote?.total ?? 0);
      const costosSinIva = Number(activeServiceCost?.subtotal ?? 0);
      const ventasSinIva = Number(activeQuote?.subtotal ?? 0);
      const gp = ventasSinIva - costosSinIva;
      const folioSellerId = String(folio?.seller_userid?._id ?? "");

      const row: Record<string, unknown> = {
        FOLIO: folio?.folio ?? "",
        "FECHA CREACION": this.formatDateDDMMYYYY(folio?.created_at),
        COSTO: this.formatCurrency(costo),
        VENTA: this.formatCurrency(venta),
        "COSTOS SIN IVA": this.formatCurrency(costosSinIva),
        "VENTAS SIN IVA": this.formatCurrency(ventasSinIva),
        GP: this.formatCurrency(gp),
        ESTATUS: this.getFolioStatus(activeServiceCost, activeQuote),
      };

      for (const seller of sellers) {
        const header = `COMISION - ${seller.full_name.toUpperCase()}`;
        const isFolioSeller = seller._id === folioSellerId;
        if (!isFolioSeller) {
          row[header] = this.formatCurrency(0);
          continue;
        }

        const commissionValue =
          seller.type_commission === "percentage"
            ? (gp * seller.commission) / 100
            : seller.commission;

        row[header] = this.formatCurrency(commissionValue);
      }

      return headers.map((header) => this.escapeCsvValue(row[header])).join(",");
    });

    return [headers.join(","), ...csvRows].join("\n");
  }

  private roundTo2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private formatCurrency(value: number): string {
    return `$${this.roundTo2(value).toFixed(2)}`;
  }

  private formatDateDDMMYYYY(value: unknown): string {
    if (!value) return "";
    const date = new Date(value as string | Date);
    if (Number.isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());

    return `${day}-${month}-${year}`;
  }

  private getFolioStatus(activeServiceCost: any, activeQuote: any): string {
    const supplierPending = this.hasPendingSupplierPayments(activeServiceCost);
    const customerPending = this.hasPendingCustomerPayments(activeQuote);

    if (supplierPending && customerPending) {
      return "FALTAN PAGOS DE PROVEEDORES, FALTAN PAGOS DE CLIENTE";
    }
    if (supplierPending) {
      return "FALTAN PAGOS DE PROVEEDORES";
    }
    if (customerPending) {
      return "FALTAN PAGOS DE CLIENTE";
    }

    return "COMPLETADO";
  }

  private hasPendingSupplierPayments(activeServiceCost: any): boolean {
    const items = Array.isArray(activeServiceCost?.items)
      ? activeServiceCost.items
      : [];

    if (items.length === 0) return false;

    for (const item of items) {
      const supplierTotal = Number(item?.total ?? 0);
      const history = Array.isArray(item?.supplier?.history)
        ? item.supplier.history
        : [];
      const paidTotal = history
        .filter((payment: any) => payment?.status === "paid")
        .reduce((sum: number, payment: any) => {
          return sum + Number(payment?.payment ?? 0);
        }, 0);

      if (paidTotal + 0.000001 < supplierTotal) {
        return true;
      }
    }

    return false;
  }

  private hasPendingCustomerPayments(activeQuote: any): boolean {
    const quoteTotal = Number(activeQuote?.total ?? 0);
    if (quoteTotal <= 0) return false;

    const history = Array.isArray(activeQuote?.history) ? activeQuote.history : [];
    const paidTotal = history
      .filter((payment: any) => payment?.status === "paid")
      .reduce((sum: number, payment: any) => {
        return sum + Number(payment?.payment ?? 0);
      }, 0);

    return paidTotal + 0.000001 < quoteTotal;
  }

  private escapeCsvValue(value: unknown): string {
    if (value === null || value === undefined) return "";

    const text =
      value instanceof Date
        ? value.toISOString()
        : typeof value === "object"
          ? JSON.stringify(value)
          : String(value);

    if (/[",\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
  }

  private async sendCsvByEmail(email: string, csvContent: string): Promise<void> {
    const datePart = new Date().toISOString().slice(0, 10);
    const filename = `folios-report-${datePart}.csv`;

    const response = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.mailerApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: {
          email: this.senderEmail,
          name: this.senderName,
        },
        to: [{ email }],
        subject: "Reporte de folios CSV",
        text: "Adjunto encontrarás el reporte de folios en formato CSV.",
        attachments: [
          {
            filename,
            content: Buffer.from(csvContent, "utf-8").toString("base64"),
            disposition: "attachment",
            type: "text/csv",
          },
        ],
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Error sending email: ${details}`);
    }
  }
}
