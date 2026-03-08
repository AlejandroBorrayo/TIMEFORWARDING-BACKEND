import { Request, Response } from "express";
import type { InviteAcceptServiceInterface } from "../../domain/services/invite-accept-service.interface";
import type { AcceptInviteDto } from "../../domain/dto/accept-invite.dto";
import type { InviteCollectionInterface } from "../../domain/collection/invite.collection.interface";
import type { DecodedUser } from "../../../auth/domain/dto/decoded-user.type";
import type { UserCollectionInterface } from "@user/domain/collection/user.collection.interface";

export function inviteAcceptController(
  service: InviteAcceptServiceInterface,
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos al usuario decodificado (inyectado por middleware de auth)
        const currentUser = {} as DecodedUser;
        const dto: AcceptInviteDto = req.body;
        // Ejecutamos el caso de uso
        const user: UserCollectionInterface | null = await service.run(
          dto,
        );

        // Respuesta 201 Created
        res.status(201).json(user);
      } catch (error: any) {
        console.error("[inviteAcceptController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error creating invite" });
      }
    },
  };
}
