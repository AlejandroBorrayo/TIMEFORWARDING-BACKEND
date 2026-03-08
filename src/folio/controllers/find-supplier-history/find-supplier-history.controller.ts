import { Request, Response } from "express";
import type { FindSupplierHistoryInterface } from "../../domain/services/find-supplier-history-service.interface";

export function findSupplierHistoryController(
  service: FindSupplierHistoryInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos al usuario decodificado (inyectado por middleware de auth)
        const { id } = req.params;

        // Ejecutamos el caso de uso
        const supplierHistory = await service.run(id);

        // Respuesta 201 Created
        res.status(201).json(supplierHistory);
      } catch (error: any) {
        console.error("[FindFolioController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error find quote" });
      }
    },
  };
}
