import type { TaxServiceInterface } from "../../domain/services/tax-service.interface";
import type { TaxRepositoryInterface } from "../../domain/repositories/tax-repository.interface";
import type { TaxCollectionInterface } from "../../domain/collection/tax.collection.interface";

export class CreateTaxService implements TaxServiceInterface {
  private taxRepository: TaxRepositoryInterface;

  constructor(
    taxRepository: TaxRepositoryInterface
  ) {
    this.taxRepository = taxRepository;
  }

  async run(tax:{name:string,amount:number}): Promise<any> {
    try {
      return await this.taxRepository.create(tax);
    } catch (err) {
      console.error("[TransactionService][run]", err);
      throw err;
    }
  }
}
