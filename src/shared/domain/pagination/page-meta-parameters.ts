export interface PageOptionsDto {
  page: number;
  perpage: number;
}

export interface PageMetaDtoParameters {
  pageOptions: PageOptionsDto;
  total: number;
  records: any[];
}
