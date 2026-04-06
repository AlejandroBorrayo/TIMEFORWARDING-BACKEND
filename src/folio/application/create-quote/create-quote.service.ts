import type { QuoteServiceInterface } from "../../domain/services/quote-service.interface";
import { QuoteDto } from "../../domain/dto/quote.dto";
import type { UserRepositoryInterface } from "../../../user/domain/repository/user-repository.interface";
import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";
import PDFDocument from "pdfkit";
import FormData from "form-data";
import fetch from "node-fetch";
import path from "path";
import {
  ItemInterface,
  FolioCollectionInterface,
  QuoteInterface,
  CustomerInterface,
} from "../../domain/collection/folio.collection.interface";
import { ObjectId } from "mongodb";
import { CustomerRepositoryInterface } from "../../../customer/domain/repositories/customer-repository.interface";
import { Types } from "mongoose";
import { urlencoded } from "express";
const apikey = "429784hjyebp1hcjg0pst";

interface PDFInterface {
  folio: string;
  no_quote: string;
  items: ItemInterface[];
  currency: string;
  notes?: string[];
  customer?: CustomerInterface;
  created_at: Date;
  period_end_date?: Date;
}

export class CreateQuoteService implements QuoteServiceInterface {
  private userRepository: UserRepositoryInterface;
  private folioRepository: FolioRepositoryInterface;
  private customerRepository: CustomerRepositoryInterface;

  constructor(
    userRepository: UserRepositoryInterface,
    folioRepository: FolioRepositoryInterface,
    customerRepository: CustomerRepositoryInterface
  ) {
    this.userRepository = userRepository;
    this.folioRepository = folioRepository;
    this.customerRepository = customerRepository;
  }

  async run(QuoteDto: QuoteDto): Promise<FolioCollectionInterface | null> {
    let subtotal = 0;
    let total_tax = 0;
    let customer = null;
    const findItemUSD = QuoteDto?.items.some(
      (item) => item?.currency === "USD"
    );

    QuoteDto?.items.map((item) => {
      let amount = findItemUSD ? item?.usd_amount : item?.amount;
      subtotal += amount * item?.quantity;
      total_tax +=
        (amount ?? 0) *
        (item?.quantity ?? 0) *
        ((item?.tax?.amount ?? 0) / 100);

    });
    const total = subtotal + total_tax;
    // Obtener usuario
    const seller_user = await this.userRepository.findByEmailOrId(
      QuoteDto?.seller_userid
    );
    if (!seller_user?._id) throw new Error("Seller not found");

    if (QuoteDto?.customer_id) {
      customer = await this.customerRepository.findOne(QuoteDto?.customer_id);
      if (!customer?._id) throw new Error("Customer not found");
    }

    const contact = customer?.contacts?.find(
      (contact) => contact?._id?.toString() === QuoteDto?.contact_id
    );

    const folio = await this.folioRepository.findOne(QuoteDto?.folio);
    if (!folio?._id) {
      throw new Error("Folio not found");
    }
    if (folio.disabled === true) {
      throw new Error("El folio está desactivado");
    }

    const folioCompanyId = folio.company_id?.toString?.();
    if (
      folioCompanyId &&
      QuoteDto.company_id &&
      folioCompanyId !== QuoteDto.company_id
    ) {
      throw new Error("Folio does not belong to this company");
    }

    const service_cost = folio?.service_cost.find(
      (costs) => costs?._id?.toString() === QuoteDto?.service_cost
    );
    const no_quotes = service_cost?.quotes?.length ?? 0;
    const quoteCurrency = findItemUSD ? "USD" : QuoteDto?.currency;
    const createdAt = new Date();
    let items: ItemInterface[] = [];
    for (const item of QuoteDto.items) {
      const tax = (item?.amount * item?.quantity) * item?.tax?.amount / 100
      const total = (item?.amount * item?.quantity)  + tax
      items.push({
        name: item?.name,
        description: item?.description,
        amount: item?.amount,
        usd_amount: item?.usd_amount,
        total,
        currency: item?.currency,
        quantity: item?.quantity,
        tax: item?.tax,
      });
    }

    const no_quote = no_quotes + 1;
    try {
      const quoteNumber = `${folio?.folio}-Q${no_quote.toString()}`;
      const pdfPath = await this.generateAndUploadQuotePdf({
        folio: folio?.folio,
        no_quote: quoteNumber,
        items,
        currency: quoteCurrency,
        notes: QuoteDto?.notes,
        customer:
          customer
            ? {
                contact_name: contact?.name,
                contact_email: contact?.email,
                contact_phone: contact?.phone,
                company: customer.company,
                company_rfc: customer.company_rfc,
              }
            : undefined,
        created_at: createdAt,
        period_end_date: QuoteDto?.period_end_date,
      });

      const quote: QuoteInterface = {
        customer_id: new ObjectId(QuoteDto?.customer_id?.toString()),
        currency: quoteCurrency,
        items,
        notes: QuoteDto?.notes,
        total,
        active: true,
        subtotal,
        tax: total_tax,
        no_quote: quoteNumber,
        period_end_date: QuoteDto?.period_end_date,
        pdf_url: pdfPath,
        created_at: createdAt,
        updated_at: createdAt,
        ...(customer && {
          customer: {
            contact_name: contact?.name,
            contact_email: contact?.email,
            contact_phone: contact?.phone,
            company: customer.company,
            company_rfc: customer.company_rfc,
          },
        }),
      };

      await this.folioRepository.updateById(
        folio?._id,
        {
          $push: {
            "service_cost.$[sc].quotes": {
              $each: [quote],
              $position: 0,
            },
          },
        },
        {
          arrayFilters: [
            { "sc._id": new Types.ObjectId(QuoteDto?.service_cost) },
          ],
        }
      );
      
      await this.folioRepository.setActiveQuote(folio?._id, quote?.no_quote);
      return await this.folioRepository.findOne(folio?.folio);
    } catch (err) {
      console.error("[CreateQuoteService][run]", err);
      throw err;
    }
  }

  private async generateAndUploadQuotePdf(data: PDFInterface): Promise<string> {
    const buffer = await this.generateQuotePdf(data);
    const filename = `quote_${data.folio}.pdf`;
    const url = await this.upload(buffer, filename);
    return url; // URL directa desde FileLu
  }

  private async generateQuotePdf(data: PDFInterface): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 40 });

        const fontsDir = path.join(process.cwd(), "fonts");
        doc.registerFont("Montserrat", path.join(fontsDir, "Montserrat-Regular.ttf"));
        doc.registerFont("Montserrat-Bold", path.join(fontsDir, "Montserrat-Bold.ttf"));
        doc.registerFont("Montserrat-SemiBold", path.join(fontsDir, "Montserrat-SemiBold.ttf"));

        // Capturar el PDF en memoria
        const buffers: Buffer[] = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        const formatCurrency = (value: number, currency?: string) => {
          return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: currency || data.currency || "MXN",
            minimumFractionDigits: 2,
          }).format(value || 0);
        };
        const formatAmount = (value: number) =>
          new Intl.NumberFormat("es-MX", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(value || 0);
        const formatDate = (value?: Date) => {
          if (!value) return "";
          const date = new Date(value);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };
        const showTotalUSD = data.items.some((item) => item?.currency === "USD");
        const summaryCurrency = showTotalUSD ? "USD" : data.currency;
        const summarySubtotal = data.items.reduce((acc, item) => {
          const quantity = Number(item?.quantity ?? 0);
          const amount = showTotalUSD
            ? Number(item?.usd_amount ?? 0)
            : Number(item?.amount ?? 0);
          return acc + quantity * amount;
        }, 0);
        const summaryTaxesMap = new Map<string, number>();
        data.items.forEach((item) => {
          const taxName = item?.tax?.name;
          const taxPercent = Number(item?.tax?.amount ?? 0);
          if (!taxName || taxName === "sin impuesto" || taxPercent <= 0) return;

          const quantity = Number(item?.quantity ?? 0);
          const amount = showTotalUSD
            ? Number(item?.usd_amount ?? 0)
            : Number(item?.amount ?? 0);
          const taxValue = quantity * amount * (taxPercent / 100);
          const current = summaryTaxesMap.get(taxName) ?? 0;
          summaryTaxesMap.set(taxName, current + taxValue);
        });
        const summaryTaxes = Array.from(summaryTaxesMap.entries()).map(
          ([name, amount]) => ({ name, amount })
        );
        const summaryTotalTax = summaryTaxes.reduce(
          (acc, tax) => acc + tax.amount,
          0
        );
        const summaryTotal = summarySubtotal + summaryTotalTax;

        const logoPath = path.join(process.cwd(), "timeforwarding.png");
        const logoBoxSize = 84;
        const textBlockWidth = 320;
        const headerGap = 18;
        const xImage = doc.page.margins.left;
        const xText = xImage + logoBoxSize + headerGap;
        const startY = doc.y;

        doc.image(logoPath, xImage, startY, {
          fit: [logoBoxSize, logoBoxSize],
          align: "center",
          valign: "center",
        });

        const textStartY = startY + 8;
        doc
          .fontSize(20)
          .fillColor("#02101d")
          .font("Montserrat-Bold")
          .text("Time Forwarding", xText, textStartY, {
          lineGap: 4,
          width: textBlockWidth,
        });

        const lineGap = 2;

        doc
          .fontSize(10.5)
          .fillColor("#374151")
          .text(
            "235 Periférico Boulevard Manuel Ávila Camacho, Ciudad de México",
            xText,
            undefined,
            { lineGap, width: textBlockWidth }
          );

        const marginLeft = doc.page.margins.left;
        const marginRight = doc.page.margins.right;
        const contentWidth = doc.page.width - marginLeft - marginRight;
        const drawInlineField = (label: string, value: string, y: number) => {
          const safeValue = value?.trim() ? value : "-";
          const labelText = `${label}:`;

          doc.fontSize(11).font("Montserrat-Bold").fillColor("#111827");
          doc.text(labelText, marginLeft, y, { lineBreak: false });

          const labelWidth = doc.widthOfString(labelText);
          doc
            .font("Montserrat")
            .text(` ${safeValue}`, marginLeft + labelWidth, y, {
              width: Math.max(contentWidth - labelWidth, 80),
              align: "left",
            });
        };
        let currentY = Math.max(doc.y + 20, startY + logoBoxSize + 20);

        if (data?.customer?.company || data?.customer?.contact_name) {
          if (data?.customer?.company) {
            drawInlineField("Nombre/Razon social", data.customer.company, currentY);
            currentY += 22;
          }

          if (data?.customer?.contact_email) {
            drawInlineField("Correo Electronico", data.customer.contact_email, currentY);
            currentY += 22;
          }

          doc.font("Montserrat");
        }

        const infoTop = currentY + 12;
        const infoPaddingY = 24;
        const infoStartY = infoTop + infoPaddingY;
        const infoRowGap = 20;
        let infoY = infoStartY;

        drawInlineField("Folio", String(data.folio || "-"), infoY);
        infoY += infoRowGap;

        drawInlineField("No. Cotizacion", data.no_quote || "-", infoY);
        infoY += infoRowGap;

        drawInlineField("Fecha", formatDate(data.created_at) || "-", infoY);

        if (data?.period_end_date) {
          infoY += infoRowGap;
          drawInlineField("Vigencia", formatDate(data.period_end_date) || "-", infoY);
        }

        const infoBottom = infoY + infoPaddingY;
        doc
          .moveTo(marginLeft, infoTop)
          .lineTo(marginLeft + contentWidth, infoTop)
          .strokeColor("#d1d5db")
          .stroke();
        doc
          .moveTo(marginLeft, infoBottom)
          .lineTo(marginLeft + contentWidth, infoBottom)
          .strokeColor("#d1d5db")
          .stroke();

        const tableTop = infoBottom + 32;
        const tableWidth = contentWidth;
        const columns = showTotalUSD
          ? [
              { key: "product", label: "Producto o servicio", width: 0.26 },
              { key: "currency", label: "Moneda", width: 0.11 },
              { key: "price", label: "Precio", width: 0.14 },
              { key: "quantity", label: "Cantidad", width: 0.11 },
              { key: "tax", label: "Impuesto", width: 0.16 },
              { key: "total", label: "Total", width: 0.11 },
              { key: "total_usd", label: "Total USD", width: 0.11 },
            ]
          : [
              { key: "product", label: "Producto o servicio", width: 0.3 },
              { key: "currency", label: "Moneda", width: 0.12 },
              { key: "price", label: "Precio", width: 0.15 },
              { key: "quantity", label: "Cantidad", width: 0.12 },
              { key: "tax", label: "Impuesto", width: 0.18 },
              { key: "total", label: "Total", width: 0.13 },
            ];

        const minRowHeight = 32;
        const headerHeight = minRowHeight - 8;
        const xMap: Record<string, number> = {};
        const wMap: Record<string, number> = {};
        let currentX = marginLeft;

        columns.forEach((column) => {
          xMap[column.key] = currentX;
          wMap[column.key] = tableWidth * column.width;
          currentX += wMap[column.key];
        });

        doc.rect(marginLeft, tableTop, tableWidth, headerHeight).fill("#02101d");
        doc.fillColor("#FFFFFF").fontSize(9).font("Montserrat-Bold");
        columns.forEach((column) => {
          doc.text(column.label, xMap[column.key], tableTop + 8, {
            width: wMap[column.key],
            align: "center",
          });
        });

        doc.fillColor("#000000").font("Montserrat");
        let y = tableTop + headerHeight;

        data.items.forEach((item, index) => {
          doc.fontSize(9);
          const descOptions = {
            width: wMap.product - 16,
            align: "center",
          } as const;
          const productName = item?.name || "-";
          const nameHeight = doc.heightOfString(productName, descOptions);

          let descriptionHeight = 0;
          if (item.description) {
            doc.font("Montserrat").fontSize(9);
            descriptionHeight = doc.heightOfString(
              item.description,
              descOptions
            );
          }

          let rowHeight = nameHeight + descriptionHeight + 26;
          if (rowHeight < minRowHeight) rowHeight = minRowHeight;
          if (index % 2 === 0) doc.rect(marginLeft, y, tableWidth, rowHeight).fill("#f4f6f9");
          doc.fillColor("#000");

          doc
            .font("Montserrat-Bold")
            .fontSize(9)
            .text(productName, xMap.product + 8, y + 8, descOptions);

          const currency = item.currency || data.currency;
          const quantity = Number(item.quantity || 0);
          const price = Number(item.amount || 0);
          const taxAmount = Number(item?.tax?.amount || 0);
          const taxRate = taxAmount / 100;
          const rowSubtotal = quantity * price;
          const totalByItem = rowSubtotal + rowSubtotal * taxRate;
          const usdPrice = Number(item.usd_amount || 0);
          const usdSubtotal = quantity * usdPrice;
          const totalByItemUSD = usdSubtotal + usdSubtotal * taxRate;
          const taxName =
            item?.tax?.name && item.tax.name !== "sin impuesto"
              ? `${item.tax.name} (${taxAmount}%)`
              : "Sin impuesto";

          const rowCenterY = y + rowHeight / 2;
          const centeredY = rowCenterY - 6;
          const twoLineY = rowCenterY - 11;

          doc
            .font("Montserrat")
            .fontSize(8.5)
            .text(currency, xMap.currency, centeredY, {
              width: wMap.currency,
              align: "center",
            })
            .text(formatCurrency(price, currency), xMap.price, centeredY, {
              width: wMap.price,
              align: "center",
            })
            .text(quantity.toString(), xMap.quantity, centeredY, {
              width: wMap.quantity,
              align: "center",
            })
            .text(taxName, xMap.tax, centeredY, {
              width: wMap.tax,
              align: "center",
            });

          doc
            .font("Montserrat-Bold")
            .fontSize(8.5)
            .text(formatAmount(totalByItem), xMap.total, twoLineY, {
              width: wMap.total,
              align: "center",
            })
            .font("Montserrat")
            .fontSize(7)
            .fillColor("#555555")
            .text(currency, xMap.total, twoLineY + 13, {
              width: wMap.total,
              align: "center",
            })
            .fillColor("#000");

          if (showTotalUSD) {
            doc
              .font("Montserrat-Bold")
              .fontSize(8.5)
              .text(formatAmount(totalByItemUSD), xMap.total_usd, twoLineY, {
                width: wMap.total_usd,
                align: "center",
              })
              .font("Montserrat")
              .fontSize(7)
              .fillColor("#555555")
              .text("USD", xMap.total_usd, twoLineY + 13, {
                width: wMap.total_usd,
                align: "center",
              })
              .fillColor("#000");
          }

          const cursorY = y + 8 + nameHeight + 2;
          if (item.description) {
            doc.fontSize(9).font("Montserrat").fillColor("#6e6e6e");
            doc.text(item.description, xMap.product + 8, cursorY, descOptions);
            doc.fillColor("#000");
          }

          doc
            .moveTo(marginLeft, y + rowHeight)
            .lineTo(marginLeft + tableWidth, y + rowHeight)
            .strokeColor("#d0d0d0")
            .stroke();

          y += rowHeight;
        });

        y += 40;
        const summaryLabelWidth = 140;
        const summaryValueWidth = 130;
        const summaryGap = 32;
        const blockWidth = summaryLabelWidth + summaryGap + summaryValueWidth;
        const blockX = marginLeft + tableWidth - blockWidth;
        const valueX = blockX + summaryLabelWidth + summaryGap;

        doc.font("Montserrat").fontSize(11).fillColor("#4b5563");
        doc.text("Subtotal", blockX, y, { width: summaryLabelWidth, align: "right" });
        doc.text(formatCurrency(summarySubtotal, summaryCurrency), valueX, y, {
          width: summaryValueWidth,
          align: "right",
        });

        summaryTaxes.forEach((taxLine) => {
          if (!taxLine?.name || !taxLine?.amount) return;
          y += 18;
          doc.text(`${taxLine.name}`, blockX, y, {
            width: summaryLabelWidth,
            align: "right",
          });
          doc.text(formatCurrency(taxLine.amount, summaryCurrency), valueX, y, {
            width: summaryValueWidth,
            align: "right",
          });
        });

        y += 20;
        doc.font("Montserrat-Bold").fontSize(15).fillColor("#111827");
        doc.text("Total", blockX, y, { width: summaryLabelWidth, align: "right" });
        doc.text(formatCurrency(summaryTotal, summaryCurrency), valueX, y, {
          width: summaryValueWidth,
          align: "right",
        });

        if (data?.notes?.length) {
          y += 46;

          doc
            .moveTo(marginLeft, y)
            .lineTo(marginLeft + tableWidth, y)
            .strokeColor("#bdbdbd")
            .stroke();

          y += 20;
          doc.fontSize(10).text("Notas:", marginLeft, y);
          y += 14;

          doc.font("Montserrat").fontSize(8);

          const noteTextOptions = {
            width: tableWidth,
            lineGap: 5,
          } as const;
          const noteParagraphGap = 14;

          data.notes.forEach((note) => {
            const trimmed = note?.trim();
            if (!trimmed) return;

            const blockHeight = doc.heightOfString(trimmed, noteTextOptions);
            doc.text(trimmed, marginLeft, y, noteTextOptions);
            y += blockHeight + noteParagraphGap;
          });
        }

        // ================================
        // FINAL
        // ================================
        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  private async upload(file: Buffer, file_name: string): Promise<string> {
    // 1) Obtener servidor
    const serverRes = await fetch(
      `https://filelu.com/api/upload/server?key=${apikey}`,
      { method: "GET", headers: { Accept: "application/json" } }
    );
    const serverJson = await serverRes.json();

    if (serverJson.status !== 200 || !serverJson.result) {
      throw new Error(
        `FileLu: Error al obtener servidor: ${serverJson.msg || "desconocido"}`
      );
    }

    const uploadUrl = serverJson.result;
    const sessId = serverJson.sess_id;

    const bufferToUpload = file;

    const attemptUpload = async (fieldName: string, opts?: any) => {
      const form = new FormData();
      form.append("sess_id", sessId);
      // NO anexes 'utype'
      if (opts) form.append(fieldName, bufferToUpload, opts);
      else form.append(fieldName, bufferToUpload, file_name);

      // IMPORTANT: No pongas headers 'Content-Type' manualmente: form-data lo setea
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        body: form as any,
      });

      // intenta parsear JSON, si falla muestra texto crudo
      let uploadJson: any;
      try {
        uploadJson = await uploadRes.json();
      } catch (e) {
        const raw = await uploadRes.text();
        console.log(`Respuesta cruda para campo ${fieldName}:`, raw);
        throw new Error(`FileLu: respuesta no JSON al subir (ver logs).`);
      }
      console.log(`uploadJson (campo ${fieldName}):`, uploadJson);
      return uploadJson;
    };

    // 3.1 probar files[] con opciones (recomendado)
    let uploadJson = await attemptUpload("files[]", {
      filename: file_name,
      contentType: "application/pdf",
    });

    // 3.2 si viene vacío, probar files[0]
    if (Array.isArray(uploadJson) && uploadJson.length === 0) {
      uploadJson = await attemptUpload("files[0]", {
        filename: file_name,
        contentType: "application/pdf",
      });
    }

    // 3.3 si sigue vacío, probar files[] sin opciones
    if (Array.isArray(uploadJson) && uploadJson.length === 0) {
      uploadJson = await attemptUpload("files[]");
    }

    const uploadedFile = Array.isArray(uploadJson)
      ? uploadJson[0]
      : uploadJson?.[0];

    if (!uploadedFile || uploadedFile.file_status !== "OK") {
      console.log("Respuesta final FileLu:", uploadJson);
      throw new Error(`FileLu: Error al subir archivo (ver logs)`);
    }

    const fileCode = uploadedFile.file_code;
    console.log("[FileLu] file_code:", fileCode);

    // 4) Obtener URL permanente via file/info
    const infoRes = await fetch(
      `https://filelu.com/api/file/info?key=${apikey}&file_code=${fileCode}`,
      { method: "GET", headers: { Accept: "application/json" } }
    );
    const infoJson: any = await infoRes.json();
    console.log("[FileLu] file/info:", JSON.stringify(infoJson));

    if (infoJson.status === 200) {
      const fileUrl =
        infoJson.result?.file_url ??
        infoJson.result?.url ??
        infoJson.result?.direct_link;
      if (fileUrl) return fileUrl as string;
    }

    // Fallback: direct_link
    const directLinkRes = await fetch(
      "https://filelu.com/api/file/direct_link",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `file_code=${fileCode}&key=${apikey}`,
      }
    );
    const linkJson: any = await directLinkRes.json();
    console.log("[FileLu] direct_link:", JSON.stringify(linkJson));

    if (linkJson.status !== 200 || !linkJson.result?.url) {
      throw new Error("FileLu: No se pudo obtener el enlace del archivo subido");
    }
    return linkJson.result.url;
  }
}
