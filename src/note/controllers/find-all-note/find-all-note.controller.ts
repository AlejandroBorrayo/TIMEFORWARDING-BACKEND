import { Request, Response } from "express";
import type { FindAllNoteServiceInterface } from "../../domain/services/find-all-note-service.interface";

export function findAllNoteController(
  service: FindAllNoteServiceInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const dto: {
          pagination: { page: number; perpage: number },
          search:string
        } = req.body;

        // Ejecutamos el caso de uso
        const transaction = await service.run( dto?.pagination, dto?.search);

        // Respuesta 201 Created
        res.status(201).json(transaction);
      } catch (error: any) {
        console.error("[FindAllNoteController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error find all customer" });
      }
    },
  };
}
