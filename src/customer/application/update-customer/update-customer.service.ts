import type { CustomerRepositoryInterface } from '../../domain/repositories/customer-repository.interface';
import type { UpdateCustomerServiceInterface } from '../../domain/services/update-customer-service.interface';
import type { CustomerCollectionInterface } from '../../domain/collection/customer.collection.interface';

export class UpdateCustomerService implements UpdateCustomerServiceInterface {
  constructor(private readonly customerRepository: CustomerRepositoryInterface) {}

  async run(
    _id:string,
    payload: CustomerCollectionInterface,
  ): Promise<CustomerCollectionInterface | null> {

    // Buscamos el address que queremos actualizar
    const existingAddress = await this.customerRepository.findOne( _id );
    if (!existingAddress) {
      const error: any = new Error('Resource not found');
      error.status = 404;
      error.property = 'USER';
      throw error;
    }

    try {
      // Actualizamos solo los campos permitidos
      await this.customerRepository.updatePartial(existingAddress, payload);

      // Retornamos el address actualizado
      return await this.customerRepository.findOne(_id );
    } catch (error) {
      console.error('[UpdateCustomerService] Error:', error);
      const err: any = new Error('Update error');
      err.status = 500;
      err.property = 'ADDRESS';
      throw err;
    }
  }
}
