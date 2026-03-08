import { Request, Response } from "express";
import type { CancelPaymentSupplierInterface } from "../../domain/services/cancel-payment-supplier.interface";

export function CancelPaymentSupplierController(
  service: CancelPaymentSupplierInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos al usuario decodificado (inyectado por middleware de auth)
        const body: { historyid: string; itemid: string } = req.body;

        // Ejecutamos el caso de uso
        const cancel = await service.run(body);

        // Respuesta 201 Created
        res.status(201).json(cancel);
      } catch (error: any) {
        console.error("[CancelPaymentSupplierController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error cancel payment supplier" });
      }
    },
  };
}
