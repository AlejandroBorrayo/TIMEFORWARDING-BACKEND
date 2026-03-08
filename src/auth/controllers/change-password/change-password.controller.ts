import { Request, Response } from 'express';
import { ChangePasswordServiceInterface } from '../../domain/services/change-password-service.interface';
import { ChangePasswordDto } from '../../domain/dto/change-password.dto';
import { DecodedUser } from '../../domain/dto/decoded-user.type';


export function changePasswordController(service: ChangePasswordServiceInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Construimos el DTO con los datos del body
        const dto:ChangePasswordDto = req.body;
        const decoded:DecodedUser = req.body;

        // Ejecutamos el servicio (caso de uso)
        const user = await service.run(decoded,dto);

        // Respuesta 201 Created
        res.status(201).json(user);
      } catch (error: any) {
        // Loguear el error si quieres
        console.error("[CreateUserPostController]", error);

        // Respuesta genérica
        res
          .status(400)
          .json({ message: error.message ?? "Error change password" });
      }
    },
  };
}
