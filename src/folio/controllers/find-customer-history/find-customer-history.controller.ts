import { Request, Response } from "express";
import type { FindCustomerHistoryInterface } from "../../domain/services/find-customer-history-service.interface";

export function findCustomerHistoryController(
  service: FindCustomerHistoryInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const customerHistory = await service.run(id);

        res.status(200).json(customerHistory);
      } catch (error: any) {
        console.error("[FindCustomerHistoryController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error find customer history" });
      }
    },
  };
}
