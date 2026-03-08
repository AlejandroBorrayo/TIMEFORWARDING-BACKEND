// src/user/controllers/update-user.put/update-user.put.controller.ts
import { Request, Response } from 'express';
import type { UpdateUserServiceInterface } from '../../domain/services/update-user-service.interface';
import { UpdateUserDto } from '../../domain/dto/update-user.dto';
import type { DecodedUser } from '../../../auth/domain/dto/decoded-user.type';

export function updateUserController(service: UpdateUserServiceInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const id = req.params.id;
        
        // Aquí simulas el @CurrentUser de NestJS.
        // Suponemos que lo inyectas en middleware y está en req.user.
        const currentUser = {} as DecodedUser;

        // Validar/transformar body
        const payload: UpdateUserDto = req.body;

        const user = await service.run(id, payload, currentUser);

        res.status(200).json(user);
      } catch (error: any) {
        console.error('[UpdateUserPutController]', error);
        res
          .status(error.status ?? 400)
          .json({ message: error.message ?? 'Error updating user' });
      }
    },
  };
}
