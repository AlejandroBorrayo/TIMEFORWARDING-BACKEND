export interface FindActiveQuotesByCustomerServiceInterface {
  run(customerId: string, sellerId?: string): Promise<any[]>;
}
