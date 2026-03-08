import { Request, Response } from "express";
import type { CustomerServiceInterface } from "../../domain/services/customer-service.interface";
import type { CustomerCollectionInterface } from "../../domain/collection/customer.collection.interface";
import type { DecodedUser } from "../../../auth/domain/dto/decoded-user.type";
import { CustomerDto } from "../../domain/dto/customer.dto";

export function createCustomerController(service: CustomerServiceInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos al usuario decodificado (inyectado por middleware de auth)
        const currentUser = {} as DecodedUser;
        const dto: CustomerDto = req.body;

        // Ejecutamos el caso de uso
        const customer: CustomerCollectionInterface = await service.run(
          dto,
        );

        // Respuesta 201 Created
        res.status(201).json(customer);
      } catch (error: any) {
        console.error("[CreateCustomerController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error creating customer" });
      }
    },
  };
}
