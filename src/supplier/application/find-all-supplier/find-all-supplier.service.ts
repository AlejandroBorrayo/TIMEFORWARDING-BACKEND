import type { SupplierCollectionInterface } from "../../domain/collection/supplier.collection.interface";
import type { FindAllSupplierServiceInterface } from "../../domain/services/find-all-supplier-service.interface";
import type { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { PageMetaDto } from "../../../shared/domain/pagination/dto/page-meta.dto";
import type { SupplierRepositoryInterface } from "../../domain/repositories/supplier-repository.interface";

export class FindAllSupplierService implements FindAllSupplierServiceInterface {
  private supplier: SupplierRepositoryInterface;

  constructor(
    supplier: SupplierRepositoryInterface
  ) {
    this.supplier = supplier;
  }

  async run(
    pagination: PageOptionsDto,
    search?: string,
    company_id?: string,
  ): Promise<PageMetaDto<SupplierCollectionInterface>> {
    try {
      const [entities, total] = await this.supplier.findAll(
        pagination,
        search,
        company_id,
      );

      return new PageMetaDto<SupplierCollectionInterface>({
        total,
        pageOptions: pagination,
        records: entities,
      });
    } catch (err) {
      console.error("[FindAllSupplierService][run]", err);
      throw err;
    }
  }
}
