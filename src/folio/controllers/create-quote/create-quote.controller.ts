import { Request, Response } from "express";
import type { QuoteServiceInterface } from "../../domain/services/quote-service.interface";
import type { FolioCollectionInterface } from "../../domain/collection/folio.collection.interface";
import type { DecodedUser } from "../../../auth/domain/dto/decoded-user.type";
import { QuoteDto } from "../../../folio/domain/dto/quote.dto";

export function createQuoteController(
  service: QuoteServiceInterface,
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos al usuario decodificado (inyectado por middleware de auth)
        const currentUser = {} as DecodedUser;
        const dto: QuoteDto = req.body;
        // Ejecutamos el caso de uso
        const quote: FolioCollectionInterface = await service.run(
          dto,
        );

        // Respuesta 201 Created
        res.status(201).json(quote);
      } catch (error: any) {
        console.error("[CreateQuoteController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error creating quote" });
      }
    },
  };
}
