import type { PaymentCustomerInterface } from "../../domain/services/payment-customer.interface";
import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";

export class PaymentCustomerService implements PaymentCustomerInterface {
  private FolioRepository: FolioRepositoryInterface;

  constructor(FolioRepository: FolioRepositoryInterface) {
    this.FolioRepository = FolioRepository;
  }

  async run(data: {
    payment: number;
    quoteid: string;
    currency: string;
  }): Promise<{ message: string }> {
    try {
      await this.FolioRepository.paymentCustomer(data);
      return { message: "ok" };
    } catch (err) {
      console.error("[PaymentCustomerService][run]", err);
      throw err;
    }
  }
}
