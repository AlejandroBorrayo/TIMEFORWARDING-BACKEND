import { Request, Response } from "express";
import type { FindAllTaxServiceInterface } from "../../domain/services/find-all-tax-service.interface";

export function findAllTaxController(
  service: FindAllTaxServiceInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const dto: {
          pagination: { page: number; perpage: number },
          search:string
        } = req.body;

        // Ejecutamos el caso de uso
        const transaction = await service.run( dto?.pagination, dto?.search);

        // Respuesta 201 Created
        res.status(201).json(transaction);
      } catch (error: any) {
        console.error("[FindAllTaxController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error find all tax" });
      }
    },
  };
}
