import { Request, Response } from "express";
import type { FindSuppliersByFolioServiceInterface } from "../../domain/services/find-suppliers-by-folio-service.interface";

export function findSuppliersByFolioController(
  service: FindSuppliersByFolioServiceInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos al usuario decodificado (inyectado por middleware de auth)
        const { id } = req.params;

        // Ejecutamos el caso de uso
        const findSupplierByFolioHistory = await service.run(id);

        // Respuesta 201 Created
        res.status(201).json(findSupplierByFolioHistory);
      } catch (error: any) {
        console.error("[FindFolioController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error find quote" });
      }
    },
  };
}
