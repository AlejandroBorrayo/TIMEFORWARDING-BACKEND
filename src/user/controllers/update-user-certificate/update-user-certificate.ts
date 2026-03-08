// src/user/controllers/update-user.put/update-user.put.controller.ts
import { Request, Response } from "express";
import type { UpdateUserCertificateServiceInterface } from "../../domain/services/update-user-certificate-service.interface";
import { UpdateUserDto } from "../../domain/dto/update-user.dto";
import type { DecodedUser } from "../../../auth/domain/dto/decoded-user.type";

export function updateUserCertificateController(
  service: UpdateUserCertificateServiceInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const id = req.params.id;


        // Archivo subido por multer
        const file = req.file; // 👈 Aquí está tu archivo

        if (!file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        const user = await service.run(id, file);

        res.status(200).json(user);
      } catch (error: any) {
        console.error("[UpdateUserPutController]", error);
        res
          .status(error.status ?? 400)
          .json({ message: error.message ?? "Error updating user" });
      }
    },
  };
}
