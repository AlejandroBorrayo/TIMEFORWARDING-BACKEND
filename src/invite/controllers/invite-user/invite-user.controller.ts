import { Request, Response } from "express";
import type { InviteUserServiceInterface } from "../../domain/services/invite-user.interface";
import type { CreateInviteDto } from "../../domain/dto/create-invite.dto";
import type { InviteCollectionInterface } from "../../domain/collection/invite.collection.interface";
import type { DecodedUser } from "../../../auth/domain/dto/decoded-user.type";

export function inviteUserController(service: InviteUserServiceInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos al usuario decodificado (inyectado por middleware de auth)
        const currentUser = {} as DecodedUser;
        const dto: CreateInviteDto = req.body;
        const apiKey = req.headers["x-api-key"] as string;

        // Ejecutamos el caso de uso
        const invite: InviteCollectionInterface | null = await service.run(
          dto,
          apiKey
        );

        // Respuesta 201 Created
        res.status(201).json(invite);
      } catch (error: any) {
        console.error("[inviteUserController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error creating invite" });
      }
    },
  };
}
