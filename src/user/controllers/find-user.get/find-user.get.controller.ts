// src/user/controllers/find-user.get/find-user.get.controller.ts
import { Request, Response } from "express";
import type { FindUserServiceInterface } from "../../domain/services/find-user-service.interface";
import type { DecodedUser } from "../../../auth/domain/dto/decoded-user.type";

export function findUserController(service: FindUserServiceInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {

        // userid viene de /user/:userid
        const { userid } = req.params;

        isEmail(userid)


        const user = await service.run(userid);

        res.status(200).json(user);
      } catch (error: any) {
        console.error("[FindUserGetController]", error);
        res
          .status(error.status ?? 400)
          .json({ message: error.message ?? "Error find user" });
      }
    },
  };
}

function isEmail(userid: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(userid);
}

