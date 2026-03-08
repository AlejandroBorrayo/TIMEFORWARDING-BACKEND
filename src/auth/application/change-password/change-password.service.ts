// src/auth/application/change-password.service.ts

import * as bcrypt from 'bcrypt';
import type { UserRepositoryInterface } from '../../../user/domain/repository/user-repository.interface';
import type { DecodedUser } from '../../domain/dto/decoded-user.type';
import type { ChangePasswordServiceInterface } from '../../domain/services/change-password-service.interface';
import type { ChangePasswordDto } from '../../domain/dto/change-password.dto';

export class ChangePasswordService implements ChangePasswordServiceInterface {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async run(
    currentUser: DecodedUser,
    request: ChangePasswordDto,
  ): Promise<{ success: boolean }> {
    // Buscamos al usuario actual
    const user = await this.userRepository.findByEmailOrIdValidation({
      _id: currentUser.sub,
    });

    if (!user || !user.password) {
      const error: any = new Error('Resource not found');
      error.status = 404;
      error.property = 'USER';
      throw error;
    }

    // Comparamos contraseña actual
    const isSamePassword = await bcrypt.compare(request.currentPassword, user.password);

    if (!isSamePassword) {
      const error: any = new Error('Current password invalid');
      error.status = 400;
      error.property = 'USER';
      throw error;
    }

    try {
      const userUpdated = await this.userRepository.updatePartial(user, {
        password: request.newPassword,
      });

      return { success: !!userUpdated };
    } catch (error: any) {
      console.error('[ChangePasswordService]', error);
      const err: any = new Error('Update error');
      err.status = 500;
      err.property = 'USER';
      throw err;
    }
  }
}
