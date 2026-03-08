import { Request, Response } from "express";
import type { FindActiveQuotesByCustomerServiceInterface } from "../../domain/services/find-active-quotes-by-customer-service.interface";

export function findActiveQuotesByCustomerController(
  service: FindActiveQuotesByCustomerServiceInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const sellerId = req.query.seller_id as string | undefined;
        const quotes = await service.run(id, sellerId);
        res.status(200).json(quotes);
      } catch (error: any) {
        console.error("[FindActiveQuotesByCustomerController]", error);
        res
          .status(400)
          .json({ message: error.message ?? "Error finding active quotes by customer" });
      }
    },
  };
}
