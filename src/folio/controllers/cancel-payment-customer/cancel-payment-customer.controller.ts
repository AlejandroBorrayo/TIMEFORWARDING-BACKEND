import { Request, Response } from "express";
import type { CancelPaymentCustomerInterface } from "../../domain/services/cancel-payment-customer.interface";

export function CancelPaymentCustomerController(
  service: CancelPaymentCustomerInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const body: { historyid: string; quoteid: string } = req.body;

        const cancel = await service.run(body);

        res.status(201).json(cancel);
      } catch (error: any) {
        console.error("[CancelPaymentCustomerController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error cancel payment customer" });
      }
    },
  };
}
