import { Request, Response } from "express";
import type { FindAllCustomerServiceInterface } from "../../domain/services/find-all-customer-service.interface";
import type { DecodedUser } from "../../../auth/domain/dto/decoded-user.type";

export function findAllCustomerController(
  service: FindAllCustomerServiceInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const dto: {
          pagination: { page: number; perpage: number };
          search?: string;
          company_id?: string;
        } = req.body;

        const transaction = await service.run(
          dto?.pagination,
          dto?.search,
          dto?.company_id,
        );

        // Respuesta 201 Created
        res.status(201).json(transaction);
      } catch (error: any) {
        console.error("[FindAllCustomerController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error find all customer" });
      }
    },
  };
}
