
export interface CancelPaymentSupplierInterface {
  run(data: {
    itemid: string;
    historyid: string;
  }): Promise<{ message: string }>;
}
