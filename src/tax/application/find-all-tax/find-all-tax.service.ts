import type { TaxCollectionInterface } from "../../domain/collection/tax.collection.interface";
import type { FindAllTaxServiceInterface } from "../../domain/services/find-all-tax-service.interface";
import type { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { PageMetaDto } from "../../../shared/domain/pagination/dto/page-meta.dto";
import type { TaxRepositoryInterface } from "../../domain/repositories/tax-repository.interface";

export class FindAllTaxService implements FindAllTaxServiceInterface {
  private taxRepository: TaxRepositoryInterface;

  constructor(
    taxRepository: TaxRepositoryInterface
  ) {
    this.taxRepository = taxRepository;
  }

  async run(
    pagination: PageOptionsDto,
  ): Promise<PageMetaDto<TaxCollectionInterface>> {
    try {
      const [entities, total] = await this.taxRepository.findAll(
        pagination,
      );

      return new PageMetaDto<TaxCollectionInterface>({
        total,
        pageOptions: pagination,
        records: entities,
      });
    } catch (err) {
      console.error("[FindAllTaxService][run]", err);
      throw err;
    }
  }
}
