import { Request, Response } from "express";
import type { SendFolioReportCsvServiceInterface } from "../../domain/services/send-folio-report-csv-service.interface";

export function sendFolioReportCsvController(
  service: SendFolioReportCsvServiceInterface,
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const dto: {
          email: string;
          folio?: string;
          seller_name?: string;
          no_quote?: number;
          customer?: string;
          seller_userid?: string;
          company_id?: string;
          start_date?: string | Date;
          end_date?: string | Date;
          supplier?: string;
        } = req.body;

        void service.run(dto).catch((serviceError: any) => {
          console.error("[SendFolioReportCsvController][BackgroundJob]", serviceError);
        });

        res.status(202).json({
          success: true,
          message: "El reporte se enviará a su email",
        });
      } catch (error: any) {
        console.error("[SendFolioReportCsvController]", error);
        res
          .status(400)
          .json({ message: error.message ?? "Error sending folio csv report" });
      }
    },
  };
}
