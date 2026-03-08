import { Request, Response } from "express";
import type { FolioServiceInterface } from "../../domain/services/folio-service.interface";
import type { FolioDto } from "../../domain/dto/folio.dto";
import type { FolioCollectionInterface } from "../../domain/collection/folio.collection.interface";
import type { DecodedUser } from "../../../auth/domain/dto/decoded-user.type";

export function createFolioController(service: FolioServiceInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos al usuario decodificado (inyectado por middleware de auth)
        const dto: FolioDto = req.body;
        // Ejecutamos el caso de uso
        const folio: FolioCollectionInterface | null = await service.run(dto);

        // Respuesta 201 Created
        res.status(201).json(folio);
      } catch (error: any) {
        console.error("[CreateFolioController]", error);
        res
          .status(400)
          .json({ message: error.message ?? "Error creating quote" });
      }
    },
  };
}
