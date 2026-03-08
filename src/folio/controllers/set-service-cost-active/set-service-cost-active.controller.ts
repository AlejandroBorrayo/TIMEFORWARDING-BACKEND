import { Request, Response } from "express";
import type { SetServiceCostActiveServiceInterface } from "../../domain/services/set-service-cost-active.interface";
import type { FolioCollectionInterface } from "../../domain/collection/folio.collection.interface";

export function setServiceCostActiveController(
  service: SetServiceCostActiveServiceInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos al usuario decodificado (inyectado por middleware de auth)
        const dto: { folio: string; no_service_cost: string } = req.body;
        // Ejecutamos el caso de uso
        const updateFolio: FolioCollectionInterface | null = await service.run(
          dto?.folio,
          dto?.no_service_cost
        );

        // Respuesta 201 Created
        res.status(201).json(updateFolio);
      } catch (error: any) {
        console.error("[setServiceCostActiveController]", error);
        res
          .status(400)
          .json({ message: error.message ?? "Error updating servoce_cost" });
      }
    },
  };
}
