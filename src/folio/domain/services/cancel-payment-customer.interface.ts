export interface CancelPaymentCustomerInterface {
  run(data: {
    quoteid: string;
    historyid: string;
  }): Promise<{ message: string }>;
}
