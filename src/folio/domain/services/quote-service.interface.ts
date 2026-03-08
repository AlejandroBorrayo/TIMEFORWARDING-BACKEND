import { QuoteDto } from "../dto/quote.dto";


export interface QuoteServiceInterface {
  run(FolioDto: QuoteDto): Promise<any>;
}
