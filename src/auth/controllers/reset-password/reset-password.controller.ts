// src/auth/controllers/reset-password.controller.ts
import { Request, Response } from "express";
import type { ResetPasswordServiceInterface } from "../../domain/services/reset-password-service.interface";
import type { ResetPasswordDto } from "../../domain/dto/reset-password.dto";
import type { ForgotPasswordDecodedUser } from "../../domain/dto/decoded-user.type";

export function resetPasswordController(
  service: ResetPasswordServiceInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Middleware JWT debe haber puesto el usuario decodificado en req.user
        const passwordResetUser: { token: string; new_password: string } =
          req.body;
        if (!passwordResetUser) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const resetPasswordDto: ResetPasswordDto = req.body;

        const result = await service.run(
          resetPasswordDto.new_password,
          passwordResetUser.token
        );

        res.status(201).json(result);
      } catch (error: any) {
        console.error("[ResetPasswordController]", error);
        res
          .status(error.status ?? 500)
          .json({ message: error.message ?? "Error resetting password" });
      }
    },
  };
}
