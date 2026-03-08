import type { TaxRepositoryInterface } from '../../domain/repositories/tax-repository.interface';
import type { UpdateTaxServiceInterface } from '../../domain/services/update-tax-service.interface';
import type { TaxCollectionInterface } from '../../domain/collection/tax.collection.interface';

export class UpdateTaxService implements UpdateTaxServiceInterface {
  constructor(private readonly taxRepository: TaxRepositoryInterface) {}

  async run(
    _id:string,
    tax: TaxCollectionInterface,
  ): Promise<TaxCollectionInterface | null> {

    // Buscamos el address que queremos actualizar
    const existingTax = await this.taxRepository.findOne( _id );
    if (!existingTax) {
      const error: any = new Error('Resource not found');
      error.status = 404;
      error.property = 'USER';
      throw error;
    }

    try {
      // Actualizamos solo los campos permitidos
      await this.taxRepository.updatePartial(existingTax, tax);

      // Retornamos el address actualizado
      return await this.taxRepository.findOne(_id );
    } catch (error) {
      console.error('[UpdateTaxService] Error:', error);
      const err: any = new Error('Update error');
      err.status = 500;
      err.property = 'ADDRESS';
      throw err;
    }
  }
}
