import { Request, Response } from "express";
import type { CreateUserServiceInterface } from "../../domain/services/create-user-service.interface";
import { CreateUserDto } from "../../domain/dto/create-user.dto";

export function createUserController(service: CreateUserServiceInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Construimos el DTO con los datos del body
        const dto: CreateUserDto = req.body;

        // Ejecutamos el servicio (caso de uso)
        const user = await service.run(dto);

        // Respuesta 201 Created
        res.status(201).json(user);
      } catch (error: any) {
        // Loguear el error si quieres
        console.error("[CreateUserPostController]", error);

        // Respuesta genérica
        res
          .status(400)
          .json({ message: error.message ?? "Error creating user" });
      }
    },
  };
}
