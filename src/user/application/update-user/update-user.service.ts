import type { UserRepositoryInterface } from '../../domain/repository/user-repository.interface';
import type { UpdateUserServiceInterface } from '../../domain/services/update-user-service.interface';
import type { UpdateUserDto } from '../../domain/dto/update-user.dto';
import type { UserCollectionInterface } from '../../domain/collection/user.collection.interface';
import type { DecodedUser } from '../../../auth/domain/dto/decoded-user.type';

export class UpdateUserService implements UpdateUserServiceInterface {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async run(
    _id: string,
    payload: UpdateUserDto,
    decodedUser: DecodedUser,
    
  ): Promise<UserCollectionInterface | null> {

    // Buscamos el usuario que queremos actualizar
    const existingUser = await this.userRepository.findByEmailOrId( _id );
    if (!existingUser) {
      const error: any = new Error('Resource not found');
      error.status = 404;
      error.property = 'USER';
      throw error;
    }
    try {
      // Actualizamos solo los campos permitidos
      await this.userRepository.updatePartial(existingUser, payload);

      // Retornamos el usuario actualizado
      return await this.userRepository.findByEmailOrId( _id );
    } catch (error) {
      console.error('[UpdateUserService] Error:', error);
      const err: any = new Error('Update error');
      err.status = 500;
      err.property = 'USER';
      throw err;
    }
  }
}
