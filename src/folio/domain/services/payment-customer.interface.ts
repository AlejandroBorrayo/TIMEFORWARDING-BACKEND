export interface PaymentCustomerInterface {
  run(data: {
    payment: number;
    quoteid: string;
    currency: string;
  }): Promise<{ message: string }>;
}
