// src/auth/controllers/login.controller.ts
import { Request, Response } from 'express';
import type { LoginServiceInterface } from '../../domain/services/login-service.interface';
import type { LoginUserDto } from '../../domain/dto/login-user.dto';

export function loginController(service: LoginServiceInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        // Obtenemos los datos del body
        const loginUser: LoginUserDto = req.body;

        // Obtenemos apiKey de headers (simulando el @ApiKey decorator)
        const apiKey = req.headers['x-api-key'] as string;

        if (!apiKey) {
          return res.status(400).json({ message: 'API key missing' });
        }

        const result = await service.run(loginUser, apiKey);

        res.status(201).json(result);
      } catch (error: any) {
        console.error('[LoginController]', error);
        res
          .status(error.status ?? 500)
          .json({ message: error.message ?? 'Error logging in' });
      }
    },
  };
}
