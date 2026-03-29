import { Types } from "mongoose";
import type { FolioServiceInterface } from "../../domain/services/folio-service.interface";
import type { FolioDto } from "../../domain/dto/folio.dto";
import type { UserRepositoryInterface } from "../../../user/domain/repository/user-repository.interface";
import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";
import type { SupplierRepositoryInterface } from "../../../supplier/domain/repositories/supplier-repository.interface";
import PDFDocument from "pdfkit";
import FormData from "form-data";
import fetch from "node-fetch";
import path from "path";
import {
  ItemInterface,
  FolioCollectionInterface,
} from "../../domain/collection/folio.collection.interface";
import { ObjectId } from "mongodb";
import * as fs from "fs";

const apikey = "429784hjyebp1hcjg0pst";

function isMongoObjectIdHex24(value: string | undefined): boolean {
  return typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value.trim());
}

function parseCompanyObjectId(company_id: string): Types.ObjectId {
  const v = company_id?.trim();
  if (!v) throw new Error("company_id is required");
  if (!isMongoObjectIdHex24(v)) {
    throw new Error("company_id is not a valid MongoDB id");
  }
  return new Types.ObjectId(v);
}

interface PDFInterface {
  folio: string;
  no_order: string;
  items: ItemInterface[];
  subtotal: number;
  notes?: string[];
  total: number;
  total_tax: number;
  taxes: { name: string; amount: number }[];
  currency: string;
  created_at: Date;
}

export class CreateFolioService implements FolioServiceInterface {
  private userRepository: UserRepositoryInterface;
  private FolioRepository: FolioRepositoryInterface;
  private supplierRepository: SupplierRepositoryInterface;

  constructor(
    userRepository: UserRepositoryInterface,
    FolioRepository: FolioRepositoryInterface,
    supplierRepository: SupplierRepositoryInterface
  ) {
    this.userRepository = userRepository;
    this.FolioRepository = FolioRepository;
    this.supplierRepository = supplierRepository;
  }

  async run(FolioDto: FolioDto): Promise<FolioCollectionInterface | null> {
    if (!FolioDto?.items?.length) {
      throw new Error("At least one item is required");
    }

    let subtotal = 0;
    let total_tax = 0;
    const taxesMap = new Map<string, number>();
    let folio = FolioDto?.current_folio ?? `TIME${Date.now()}`;
    const findItemUSD = FolioDto?.items.some((item) => item?.currency === "USD");
    const allItemsAreMXN =
      (FolioDto?.items?.length ?? 0) > 0 &&
      FolioDto.items.every((item) => item?.currency === "MXN");
    const serviceCostCurrency = findItemUSD
      ? "USD"
      : allItemsAreMXN
      ? "MXN"
      : FolioDto?.currency;
    const createdAt = new Date();

    for (const item of FolioDto?.items ?? []) {
      const amount = findItemUSD ? item?.usd_amount : item?.amount;
      const itemSubtotal = (amount ?? 0) * (item?.quantity ?? 0);
      const itemTax =
        itemSubtotal * ((Number(item?.tax?.amount ?? 0) ?? 0) / 100);

      subtotal += itemSubtotal;
      total_tax += itemTax;

      if (item?.tax?.name && item.tax.name !== "sin impuesto") {
        const previousAmount = taxesMap.get(item.tax.name) ?? 0;
        taxesMap.set(item.tax.name, previousAmount + itemTax);
      }
    }

    const taxes = Array.from(taxesMap.entries()).map(([name, amount]) => ({
      name,
      amount,
    }));
    const total = subtotal + total_tax;

    let companyObjectId: Types.ObjectId;
    try {
      companyObjectId = parseCompanyObjectId(FolioDto.company_id);
    } catch (e: any) {
      console.error("[CreateFolioService] company_id", e?.message);
      throw e;
    }

    const seller_user = await this.userRepository.findByEmailOrId(
      FolioDto?.seller_userid
    );
    if (!seller_user?._id) throw new Error("Seller not found");

    let current_folio: FolioCollectionInterface | null = null;
    let no_service_cost = `${folio}-C1`;
    if (FolioDto?.current_folio) {
      current_folio = await this.FolioRepository.findOne(FolioDto.current_folio);
      if (!current_folio?._id) {
        throw new Error("Folio not found");
      }
      const existingCompany = current_folio.company_id?.toString?.();
      if (
        existingCompany &&
        FolioDto.company_id &&
        existingCompany !== FolioDto.company_id
      ) {
        throw new Error("Folio does not belong to this company");
      }
      folio = current_folio.folio;
      no_service_cost = `${current_folio.folio}-C${
        (current_folio.service_cost?.length ?? 0) + 1
      }`;
    }

    let items: ItemInterface[] = [];
    for (let i = 0; i < FolioDto.items.length; i++) {
      const item = FolioDto.items[i];
      const rowSubtotal = (item?.amount ?? 0) * (item?.quantity ?? 0);
      const tax = rowSubtotal * ((item?.tax?.amount ?? 0) / 100);
      const total = rowSubtotal + tax;

      const sid = item?.supplier_id?.trim();
      if (!sid || !isMongoObjectIdHex24(sid)) {
        throw new Error(
          `Item ${i + 1}: supplier_id must be a valid MongoDB id (24 hex chars)`
        );
      }

      const supplier = await this.supplierRepository.findOne(sid);
      if (!supplier?._id) {
        throw new Error(`Item ${i + 1}: supplier not found (${sid})`);
      }
      items.push({
        name: item?.name,
        description: item?.description,
        amount: item?.amount,
        usd_amount: item?.usd_amount,
        currency: item?.currency,
        quantity: item?.quantity,
        total,
        supplier: {
          _id: new Types.ObjectId(supplier?._id.toString()),
          name: supplier?.name,
          history: [],
        },
        tax: item?.tax,
      });
    }

    try {
      const pdfPath = await this.generateAndUploadQuotePdf({
        folio,
        no_order: no_service_cost,
        items,
        total_tax,
        subtotal,
        total,
        taxes,
        currency: serviceCostCurrency,
        created_at: createdAt,
      });

      const service_cost = {
        items,
        no_service_cost,
        total,
        subtotal,
        active: true,
        tax: total_tax,
        pdf_url: pdfPath,
        currency: serviceCostCurrency,
        deleted: false,
        quotes: [],
        created_at: createdAt,
        updated_at: createdAt,
      };

      if (current_folio?._id) {
        await this.FolioRepository.updateById(current_folio._id, {
          $push: {
            service_cost: {
              ...service_cost,
            },
          },
        });

        await this.FolioRepository.setActiveServiceCost(
          current_folio?._id,
          service_cost?.no_service_cost
        );
      }

      if (!FolioDto?.current_folio) {
        const folioData: FolioCollectionInterface = {
          seller_userid: new ObjectId(seller_user?._id.toString()),
          company_id: companyObjectId,
          folio,
          service_cost: [service_cost],
        };
        try {
          const folio_created = await this.FolioRepository.create(folioData);
          if (!folio_created?._id) throw new Error("Error creating folio");
        } catch (e: any) {
          if (e?.code === 11000) {
            throw new Error(
              "A folio with this code already exists (duplicate key)",
            );
          }
          console.error("[CreateFolioService] Mongo create", e?.message, e);
          throw e;
        }
      }

      if (!folio) throw new Error("Error processing folio");
      return await this.FolioRepository.findOne(folio);
    } catch (err: any) {
      console.error("[CreateFolioService] failed", {
        folio: FolioDto?.current_folio ?? "new",
        hasItems: !!FolioDto?.items?.length,
        message: err?.message,
        code: err?.code,
      });
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

        // Capturar el PDF en memoria
        const buffers: Buffer[] = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        // ================================
        // FORMATTERS + CALCULOS (igual que QuoteEditor)
        // ================================
        const formatCurrency = (value: number, currency?: string) => {
          return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: currency || data.currency || "MXN",
            minimumFractionDigits: 2,
          }).format(value || 0);
        };
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

        // ================================
        // ENCABEZADO
        // ================================
        const logoPath = path.join(process.cwd(), "timeforwarding.png");
        if (!fs.existsSync(logoPath)) {
          throw new Error(
            `PDF: missing logo file at ${logoPath} (cwd: ${process.cwd()})`,
          );
        }
        const xImage = 40;
        const logoBoxSize = 84;
        const xText = xImage + logoBoxSize + 18;
        const startY = doc.y;

        doc.image(logoPath, xImage, startY, {
          fit: [logoBoxSize, logoBoxSize],
          align: "center",
          valign: "center",
        });

        doc.fontSize(20).fillColor("#02101d").font("Helvetica").text("Time Forwarding", xText, startY + 2, {
          lineGap: 6,
        });

        const lineGap = 2;

        doc
          .fontSize(10.5)
          .fillColor("#374151")
          .text(
            "235 Periférico Boulevard Manuel Ávila Camacho, Ciudad de México",
            xText,
            undefined,
            { lineGap }
          )
          .text("contabilidad@timeforwarding.com.mx", xText, undefined, {
            lineGap,
          })
          .text("5552542235", xText, undefined, { lineGap });

        const marginLeft = doc.page.margins.left;
        const marginRight = doc.page.margins.right;
        const contentWidth = doc.page.width - marginLeft - marginRight;
        const drawInlineField = (label: string, value: string, y: number) => {
          const safeValue = value?.trim() ? value : "-";
          const labelText = `${label}:`;

          doc.fontSize(11).font("Helvetica-Bold").fillColor("#111827");
          doc.text(labelText, marginLeft, y, { lineBreak: false });

          const labelWidth = doc.widthOfString(labelText);
          doc
            .font("Helvetica")
            .text(` ${safeValue}`, marginLeft + labelWidth, y, {
              width: Math.max(contentWidth - labelWidth, 80),
              align: "left",
            });
        };

        // Bloque como en la page: borde arriba/abajo y labels a la izquierda
        doc.moveDown(2.8);
        const infoTop = doc.y;
        const infoPaddingY = 24;
        const infoStartY = infoTop + infoPaddingY;
        const infoRowGap = 20;
        let infoY = infoStartY;

        drawInlineField("Folio", String(data.folio || "-"), infoY);
        infoY += infoRowGap;

        drawInlineField("No. de costo", data.no_order || "-", infoY);
        infoY += infoRowGap;

        drawInlineField("Fecha", formatDate(data.created_at) || "-", infoY);

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

        // ================================
        // TABLA
        // ================================
        const tableTop = infoBottom + 32;
        const tableWidth = contentWidth;
        const hasUSDItem = showTotalUSD;

        const columns = hasUSDItem
          ? [
              { key: "product", label: "Producto o servicio", width: 0.22 },
              { key: "supplier", label: "Provedor", width: 0.16 },
              { key: "currency", label: "Moneda", width: 0.09 },
              { key: "price", label: "Precio", width: 0.11 },
              { key: "quantity", label: "Cantidad", width: 0.09 },
              { key: "tax", label: "Impuesto", width: 0.13 },
              { key: "total", label: "Total", width: 0.1 },
              { key: "total_usd", label: "Total USD", width: 0.1 },
            ]
          : [
              { key: "product", label: "Producto o servicio", width: 0.27 },
              { key: "supplier", label: "Provedor", width: 0.18 },
              { key: "currency", label: "Moneda", width: 0.1 },
              { key: "price", label: "Precio", width: 0.11 },
              { key: "quantity", label: "Cantidad", width: 0.1 },
              { key: "tax", label: "Impuesto", width: 0.14 },
              { key: "total", label: "Total", width: 0.1 },
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

        // HEADER
        doc.rect(marginLeft, tableTop, tableWidth, headerHeight).fill("#02101d");
        doc.fillColor("#FFFFFF").fontSize(9).font("Helvetica");
        columns.forEach((column) => {
          doc.text(column.label, xMap[column.key], tableTop + 8, {
            width: wMap[column.key],
            align: "center",
          });
        });

        doc.fillColor("#000000").font("Helvetica");
        let y = tableTop + headerHeight;

        // ================================
        // FILAS DINÁMICAS
        // ================================
        data.items.forEach((item, index) => {
          doc.fontSize(10);

          const descOptions = {
            width: wMap.product - 16,
            align: "center",
          } as const;
          const supplierOptions = {
            width: wMap.supplier,
            align: "center",
          } as const;

          const productName = item.name || "-";
          const nameHeight = doc.heightOfString(productName, descOptions);

          let descriptionHeight = 0;
          if (item.description) {
            doc.font("Helvetica").fontSize(9);
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
            .font("Helvetica-Bold")
            .fontSize(9)
            .text(productName, xMap.product + 8, y + 8, descOptions);

          const supplierName = item?.supplier?.name || "-";

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

          doc
            .font("Helvetica")
            .fontSize(8.5)
            .text(supplierName, xMap.supplier, centeredY, supplierOptions)
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
            })
            .text(formatCurrency(totalByItem, currency), xMap.total, centeredY, {
              width: wMap.total,
              align: "center",
            });

          if (hasUSDItem) {
            doc.text(formatCurrency(totalByItemUSD, "USD"), xMap.total_usd, centeredY, {
              width: wMap.total_usd,
              align: "center",
            });
          }

          const cursorY = y + 8 + nameHeight + 2;
          if (item.description) {
            doc.fontSize(9).font("Helvetica").fillColor("#6e6e6e");
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

        // ================================
        // TOTALES
        // ================================

        y += 40;

        const summaryLabelWidth = 140;
        const summaryValueWidth = 130;
        const summaryGap = 32;
        const blockWidth = summaryLabelWidth + summaryGap + summaryValueWidth;
        const blockX = marginLeft + tableWidth - blockWidth;
        const valueX = blockX + summaryLabelWidth + summaryGap;

        doc.font("Helvetica").fontSize(11).fillColor("#4b5563");
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

        doc.font("Helvetica-Bold").fontSize(15).fillColor("#111827");
        doc.text("Total", blockX, y, { width: summaryLabelWidth, align: "right" });
        doc.text(formatCurrency(summaryTotal, summaryCurrency), valueX, y, {
          width: summaryValueWidth,
          align: "right",
        });

        // ================================
        // NOTAS
        // ================================
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

          doc.font("Helvetica").fontSize(8);

          const noteTextOptions = {
            width: tableWidth,
            lineGap: 2,
          } as const;
          const noteParagraphGap = 10;

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

    // 4) Obtener enlace directo
    const directLinkRes = await fetch(
      "https://filelu.com/api/file/direct_link",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `file_code=${fileCode}&key=${apikey}`,
      }
    );

    const linkJson: any = await directLinkRes.json();
    if (linkJson.status !== 200 || !linkJson.result?.url) {
      console.log("directLinkRes:", linkJson);
      throw new Error(
        "FileLu: No se pudo obtener el enlace del archivo subido"
      );
    }
    return linkJson.result.url;
  }
}
