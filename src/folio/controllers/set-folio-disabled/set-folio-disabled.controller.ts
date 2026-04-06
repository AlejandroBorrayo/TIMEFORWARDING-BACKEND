import { Request, Response } from "express";
import type { SetFolioDisabledServiceInterface } from "../../domain/services/set-folio-disabled-service.interface";
import type { FolioCollectionInterface } from "../../domain/collection/folio.collection.interface";
import type { SetFolioDisabledDto } from "../../domain/dto/set-folio-disabled.dto";

export function setFolioDisabledController(
  service: SetFolioDisabledServiceInterface,
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const dto = req.body as SetFolioDisabledDto;
        const updated: FolioCollectionInterface | null = await service.run(dto);
        res.status(200).json(updated);
      } catch (error: any) {
        console.error("[setFolioDisabledController]", error);
        res
          .status(400)
          .json({ message: error.message ?? "Error al actualizar el folio" });
      }
    },
  };
}
