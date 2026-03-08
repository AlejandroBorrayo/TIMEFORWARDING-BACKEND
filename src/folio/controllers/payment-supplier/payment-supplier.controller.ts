import { Request, Response } from "express";
import type { PaymentSupplierInterface } from "../../domain/services/payment-supplier.interface";

export function PaymentSupplierController(service: PaymentSupplierInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos al usuario decodificado (inyectado por middleware de auth)
        const body: { payment: number; itemid: string,currency:string } = req.body;

        // Ejecutamos el caso de uso
        const payment = await service.run(body);

        // Respuesta 201 Created
        res.status(201).json(payment);
      } catch (error: any) {
        console.error("[PaymentSupplierController]", error);

        res.status(400).json({ message: error.message ?? "Error payment supplier" });
      }
    },
  };
}
