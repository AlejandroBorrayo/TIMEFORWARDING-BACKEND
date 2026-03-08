import type { FolioCollectionInterface } from "../../domain/collection/folio.collection.interface";
import type { PaymentSupplierInterface } from "../../domain/services/payment-supplier.interface";
import type { FolioRepositoryInterface } from "../../domain/repositories/folio-repository.interface";

export class PaymentSupplierService implements PaymentSupplierInterface {
  private FolioRepository: FolioRepositoryInterface;

  constructor(FolioRepository: FolioRepositoryInterface) {
    this.FolioRepository = FolioRepository;
  }

  async run(data: {
    payment: number;
    itemid: string;
    currency: string;
  }): Promise<{ message: string }> {
    try {
      await this.FolioRepository.paymentSupplier(data);
      return { message: "ok" };
    } catch (err) {
      console.error("[FindFolioService][run]", err);
      throw err;
    }
  }
}
