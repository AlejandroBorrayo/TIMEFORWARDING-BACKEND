import type { SupplierCollectionInterface } from "../../domain/collection/supplier.collection.interface";
import type { FindSupplierServiceInterface } from "../../domain/services/find-supplier-service.interface";
import type { SupplierRepositoryInterface } from "../../domain/repositories/supplier-repository.interface";

export class FindSupplierService implements FindSupplierServiceInterface {
  private supplier: SupplierRepositoryInterface;

  constructor(
    supplier: SupplierRepositoryInterface
  ) {
    this.supplier = supplier;
  }

  async run(
    _id:string
  ): Promise<SupplierCollectionInterface | null> {
    try {
      return await this.supplier.findOne(_id);


    } catch (err) {
      console.error("[FindSupplierService][run]", err);
      throw err;
    }
  }
}
