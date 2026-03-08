import type { TaxCollectionInterface } from "../../domain/collection/tax.collection.interface";
import type { FindTaxServiceInterface } from "../../domain/services/find-tax-service.interface";
import type { TaxRepositoryInterface } from "../../domain/repositories/tax-repository.interface";

export class FindTaxService implements FindTaxServiceInterface {
  private taxRepository: TaxRepositoryInterface;

  constructor(
    taxRepository: TaxRepositoryInterface
  ) {
    this.taxRepository = taxRepository;
  }

  async run(
    _id:string
  ): Promise<TaxCollectionInterface | null> {
    try {
      return await this.taxRepository.findOne(_id);


    } catch (err) {
      console.error("[FindTaxService][run]", err);
      throw err;
    }
  }
}
