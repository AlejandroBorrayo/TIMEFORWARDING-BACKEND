import type { CancelPaymentCustomerInterface } from "../../domain/services/cancel-payment-customer.interface";
import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";

export class CancelPaymentCustomerService implements CancelPaymentCustomerInterface {
  private FolioRepository: FolioRepositoryInterface;

  constructor(FolioRepository: FolioRepositoryInterface) {
    this.FolioRepository = FolioRepository;
  }

  async run(data: {
    quoteid: string;
    historyid: string;
  }): Promise<{ message: string }> {
    try {
      await this.FolioRepository.cancelPaymentCustomer(data);
      return { message: "ok" };
    } catch (err) {
      console.error("[CancelPaymentCustomerService][run]", err);
      throw err;
    }
  }
}
