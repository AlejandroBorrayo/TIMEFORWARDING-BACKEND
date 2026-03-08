import { Request, Response } from "express";
import type { SupplierServiceInterface } from "../../domain/services/supplier-service.interface";
import type { SupplierCollectionInterface } from "../../domain/collection/supplier.collection.interface";
import type { DecodedUser } from "../../../auth/domain/dto/decoded-user.type";
import { SupplierDto } from "../../domain/dto/supplier.dto";

export function createSupplierController(service: SupplierServiceInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos al usuario decodificado (inyectado por middleware de auth)
        const currentUser = {} as DecodedUser;
        const dto: SupplierDto = req.body;

        // Ejecutamos el caso de uso
        const customer: SupplierCollectionInterface = await service.run(
          dto,
        );

        // Respuesta 201 Created
        res.status(201).json(customer);
      } catch (error: any) {
        console.error("[CreateSupplierController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error creating supplier" });
      }
    },
  };
}
