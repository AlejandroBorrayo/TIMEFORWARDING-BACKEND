import { Request, Response } from "express";
import type { SetQuoteActiveServiceInterface } from "../../domain/services/set-quote-active.interface";
import type { FolioCollectionInterface } from "../../domain/collection/folio.collection.interface";

export function setQuoteActiveController(
  service: SetQuoteActiveServiceInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos al usuario decodificado (inyectado por middleware de auth)
        const dto: { folio: string; quote: string } = req.body;
        // Ejecutamos el caso de uso
        console.log("mansd,mnasdasdasdads")
        const updateFolio: FolioCollectionInterface | null = await service.run(
          dto?.folio,
          dto?.quote
        );

        // Respuesta 201 Created
        res.status(201).json(updateFolio);
      } catch (error: any) {
        console.error("[setQuoteActiveController]", error);
        res
          .status(400)
          .json({ message: error.message ?? "Error updating servoce_cost" });
      }
    },
  };
}
