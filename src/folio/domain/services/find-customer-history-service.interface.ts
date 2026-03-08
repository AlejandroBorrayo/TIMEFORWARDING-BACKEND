export interface FindCustomerHistoryInterface {
  run(customerId: string): Promise<any>;
}
