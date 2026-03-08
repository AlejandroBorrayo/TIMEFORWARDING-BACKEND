import { Request, Response } from "express";
import type { FindNoteServiceInterface } from "../../domain/services/find-note-service.interface";

export function findNoteController(
  service: FindNoteServiceInterface
) {
  return {
    run: async (req: Request, res: Response) => {
      try {

        const { id } = req.params;


        // Ejecutamos el caso de uso
        const customer = await service.run(id);

        // Respuesta 201 Created
        res.status(201).json(customer);
      } catch (error: any) {
        console.error("[FindNoteController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error find customer" });
      }
    },
  };
}
