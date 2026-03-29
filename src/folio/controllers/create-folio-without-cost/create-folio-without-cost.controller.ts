import { Request, Response } from "express";
import type { CreateFolioWithoutCostServiceInterface } from "../../domain/services/create-folio-without-cost-service.interface";
import type { CreateFolioWithoutCostDto } from "../../domain/dto/create-folio-without-cost.dto";
import type { FolioCollectionInterface } from "../../domain/collection/folio.collection.interface";

export function createFolioWithoutCostController(
  service: CreateFolioWithoutCostServiceInterface,
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const dto: CreateFolioWithoutCostDto = req.body;
        const folio: FolioCollectionInterface | null = await service.run(dto);
        res.status(201).json(folio);
      } catch (error: any) {
        console.error("[CreateFolioWithoutCostController]", error);
        res.status(400).json({
          message: error.message ?? "Error creating folio without cost",
        });
      }
    },
  };
}
