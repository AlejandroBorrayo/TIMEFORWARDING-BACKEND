import { Request, Response } from "express";
import type { TaxServiceInterface } from "../../domain/services/tax-service.interface";
import type { TaxCollectionInterface } from "../../domain/collection/tax.collection.interface";
import type { DecodedUser } from "../../../auth/domain/dto/decoded-user.type";

export function createTaxController(service: TaxServiceInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos al usuario decodificado (inyectado por middleware de auth)
        const dto: { name: string,amount:number } = req.body;

        // Ejecutamos el caso de uso
        const note: TaxCollectionInterface = await service.run(dto);

        // Respuesta 201 Created
        res.status(201).json(note);
      } catch (error: any) {
        console.error("[CreateTaxController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error creating customer" });
      }
    },
  };
}
