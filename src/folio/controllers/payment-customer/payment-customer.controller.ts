import { Request, Response } from "express";
import type { PaymentCustomerInterface } from "../../domain/services/payment-customer.interface";

export function PaymentCustomerController(service: PaymentCustomerInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const body: { payment: number; quoteid: string; currency: string } = req.body;

        const payment = await service.run(body);

        res.status(201).json(payment);
      } catch (error: any) {
        console.error("[PaymentCustomerController]", error);

        res.status(400).json({ message: error.message ?? "Error payment customer" });
      }
    },
  };
}
