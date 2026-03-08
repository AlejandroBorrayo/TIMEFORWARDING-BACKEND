// src/user/application/find-user.service.ts

import type { UserRepositoryInterface } from '../../domain/repository/user-repository.interface';
import type { FindUserServiceInterface } from '../..//domain/services/find-user-service.interface';
import type { UserCollectionInterface } from '../..//domain/collection/user.collection.interface';

export class FindUserService implements FindUserServiceInterface {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async run(userid?: string): Promise<UserCollectionInterface> {
    if (!userid) {
      const error: any = new Error('Resource not found');
      error.status = 404;
      error.property = 'USER';
      throw error;
    }

    const user = await this.userRepository.findByEmailOrId(userid);
    if (!user) {
      const error: any = new Error('Resource not found');
      error.status = 404;
      error.property = 'USER';
      throw error;
    }

    return user;
  }
}
