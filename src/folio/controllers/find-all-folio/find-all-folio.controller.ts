import { Request, Response } from "express";
import type { FindAllFolioServiceInterface } from "../../domain/services/find-all-folio-service.interface";
import type { DecodedUser } from "../../../auth/domain/dto/decoded-user.type";

export function findAllFolioController(
  service: FindAllFolioServiceInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos al usuario decodificado (inyectado por middleware de auth)
        const currentUser = {} as DecodedUser;
        const dto: {
          pagination: { page: number; perpage: number };
          folio?: string;
          no_quote?: number;
          customer?: string;
          seller_userid?: string;
          seller_name?: string;
          start_date?: string | Date;
          end_date?: string | Date;
          supplier?:string
        } = req.body;

        // Ejecutamos el caso de uso
        const transaction = await service.run(dto);

        // Respuesta 201 Created
        res.status(201).json(transaction);
      } catch (error: any) {
        console.error("[CreateTransactionController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error creating transaction" });
      }
    },
  };
}
