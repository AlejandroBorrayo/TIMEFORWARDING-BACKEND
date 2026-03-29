export interface SendFolioReportCsvServiceInterface {
  run(data: {
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
  }): Promise<{
    success: boolean;
    message: string;
    total: number;
  }>;
}
