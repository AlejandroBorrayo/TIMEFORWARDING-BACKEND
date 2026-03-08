import { Request, Response } from "express";
import type { FindCustomerServiceInterface } from "../../domain/services/find-customer-service.interface";

export function findCustomerController(
  service: FindCustomerServiceInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {

        const { id } = req.params;


        // Ejecutamos el caso de uso
        const customer = await service.run(id);

        // Respuesta 201 Created
        res.status(201).json(customer);
      } catch (error: any) {
        console.error("[FindCustomerController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error find customer" });
      }
    },
  };
}
