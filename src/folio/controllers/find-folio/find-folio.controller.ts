import { Request, Response } from "express";
import type { FindFolioServiceInterface } from "../../domain/services/find-folio-service.interface";
import type { DecodedUser } from "../../../auth/domain/dto/decoded-user.type";

export function findFolioController(
  service: FindFolioServiceInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos al usuario decodificado (inyectado por middleware de auth)
        const currentUser = {} as DecodedUser;
        const { id } = req.params;

        // Ejecutamos el caso de uso
        const folio = await service.run(id);

        // Respuesta 201 Created
        res.status(201).json(folio);
      } catch (error: any) {
        console.error("[FindFolioController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error find quote" });
      }
    },
  };
}
