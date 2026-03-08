// src/user/controllers/update-user.put/update-user.put.controller.ts
import { Request, Response } from 'express';
import type { UpdateNoteServiceInterface } from '../../domain/services/update-note-service.interface';
import type { DecodedUser } from '../../../auth/domain/dto/decoded-user.type';
import type { NoteCollectionInterface } from '../../domain/collection/note.collection.interface';

export function updateNoteController(service: UpdateNoteServiceInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const id = req.params.id;
        
        // Aquí simulas el @CurrentUser de NestJS.
        // Suponemos que lo inyectas en middleware y está en req.user.
        const currentUser = {} as DecodedUser;

        // Validar/transformar body
        const payload: NoteCollectionInterface = req.body;
        const user = await service.run(id, payload);

        res.status(200).json(user);
      } catch (error: any) {
        console.error('[UpdatecustomerPutController]', error);
        res
          .status(error.status ?? 400)
          .json({ message: error.message ?? 'Error updating customer' });
      }
    },
  };
}
