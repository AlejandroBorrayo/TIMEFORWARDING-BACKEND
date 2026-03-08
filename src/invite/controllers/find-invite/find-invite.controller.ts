import { Request, Response } from "express";
import type { findInviteUserServiceInterface } from "../../domain/services/find-invite.interface";
import type { InviteCollectionInterface } from "../../domain/collection/invite.collection.interface";
import type { DecodedUser } from "../../../auth/domain/dto/decoded-user.type";

export function findInviteController(
  service: findInviteUserServiceInterface,
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos al usuario decodificado (inyectado por middleware de auth)
        const currentUser = {} as DecodedUser;
        const {id}  = req.params;
        // Ejecutamos el caso de uso
        const invite: InviteCollectionInterface | null = await service.run(
          id,
        );

        // Respuesta 201 Created
        res.status(201).json(invite);
      } catch (error: any) {
        console.error("[findInviteController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error find invite" });
      }
    },
  };
}
