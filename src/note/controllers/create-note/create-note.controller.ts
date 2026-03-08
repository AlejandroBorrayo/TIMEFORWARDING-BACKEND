import { Request, Response } from "express";
import type { NoteServiceInterface } from "../../domain/services/note-service.interface";
import type { NoteCollectionInterface } from "../../domain/collection/note.collection.interface";
import type { DecodedUser } from "../../../auth/domain/dto/decoded-user.type";

export function createNoteController(service: NoteServiceInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos al usuario decodificado (inyectado por middleware de auth)
        const dto: { note: string } = req.body;

        // Ejecutamos el caso de uso
        const note: NoteCollectionInterface = await service.run(dto?.note);

        // Respuesta 201 Created
        res.status(201).json(note);
      } catch (error: any) {
        console.error("[CreateNoteController]", error);

        res
          .status(400)
          .json({ message: error.message ?? "Error creating customer" });
      }
    },
  };
}
