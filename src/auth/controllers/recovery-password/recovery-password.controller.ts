// src/auth/controllers/reset-password.controller.ts
import { Request, Response } from "express";
import type { RecoveryPasswordServiceInterface } from "../../domain/services/recovery-password-service.interface";

export function recoveryPasswordController(
  service: RecoveryPasswordServiceInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Middleware JWT debe haber puesto el usuario decodificado en req.user
        const body: { email: string } = req.body;
        const apiKey = req.headers["x-api-key"] as string;
        if (!body?.email) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const result = await service.run(body?.email,apiKey);

        res.status(201).json(result);
      } catch (error: any) {
        console.error("[recoveryPasswordController]", error);
        res
          .status(error.status ?? 500)
          .json({ message: error.message ?? "Error recovery password" });
      }
    },
  };
}
