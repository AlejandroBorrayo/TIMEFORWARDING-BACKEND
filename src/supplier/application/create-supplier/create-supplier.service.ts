import type { SupplierServiceInterface } from "../../domain/services/supplier-service.interface";
import type { SupplierRepositoryInterface } from "../../domain/repositories/supplier-repository.interface";
import type { SupplierCollectionInterface } from "../../domain/collection/supplier.collection.interface";
import { Types } from "mongoose";
import { SupplierDto } from "../../domain/dto/supplier.dto";

export class CreateSupplierService implements SupplierServiceInterface {
  private supplierRepository: SupplierRepositoryInterface;

  constructor(
    supplierRepository: SupplierRepositoryInterface
  ) {
    this.supplierRepository = supplierRepository;
  }

  async run(supplier: SupplierDto): Promise<any> {
    try {


      return await this.supplierRepository.create(supplier);
    } catch (err) {
      console.error("[CreateSupplierService][run]", err);
      throw err;
    }
  }
}
