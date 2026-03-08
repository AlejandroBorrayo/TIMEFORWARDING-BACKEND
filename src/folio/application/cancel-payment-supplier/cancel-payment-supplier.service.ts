import type { CancelPaymentSupplierInterface } from "../../domain/services/cancel-payment-supplier.interface";
import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";

export class CancelPaymentSupplierService implements CancelPaymentSupplierInterface {
  private FolioRepository: FolioRepositoryInterface;

  constructor(FolioRepository: FolioRepositoryInterface) {
    this.FolioRepository = FolioRepository;
  }

  async run(data: {
    itemid: string;
    historyid: string;
  }): Promise<{ message: string }> {
    try {
      await this.FolioRepository.cancelPaymentSupplier(data);
      return { message: "ok" };
    } catch (err) {
      console.error("[CancelPaymentSupplierService][run]", err);
      throw err;
    }
  }
}
