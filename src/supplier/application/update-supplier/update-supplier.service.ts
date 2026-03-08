import type { SupplierRepositoryInterface } from '../../domain/repositories/supplier-repository.interface';
import type { UpdateSupplierServiceInterface } from '../../domain/services/update-supplier-service.interface';
import type { SupplierCollectionInterface } from '../../domain/collection/supplier.collection.interface';

export class UpdateSupplierService implements UpdateSupplierServiceInterface {
  constructor(private readonly supplierRepository: SupplierRepositoryInterface) {}

  async run(
    _id:string,
    payload: SupplierCollectionInterface,
  ): Promise<SupplierCollectionInterface | null> {

    // Buscamos el address que queremos actualizar
    const existingSupplier = await this.supplierRepository.findOne( _id );
    if (!existingSupplier) {
      const error: any = new Error('Resource not found');
      error.status = 404;
      error.property = 'USER';
      throw error;
    }

    try {
      // Actualizamos solo los campos permitidos
      await this.supplierRepository.updatePartial(existingSupplier, payload);

      // Retornamos el address actualizado
      return await this.supplierRepository.findOne(_id );
    } catch (error) {
      console.error('[UpdateSupplierService] Error:', error);
      const err: any = new Error('Update error');
      err.status = 500;
      err.property = 'SUPPLIER';
      throw err;
    }
  }
}
