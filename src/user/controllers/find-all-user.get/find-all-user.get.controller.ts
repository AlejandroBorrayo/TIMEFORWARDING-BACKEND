// src/user/controllers/find-user.get/find-user.get.controller.ts
import { Request, Response } from "express";
import type { FindAllUserServiceInterface } from "../../domain/services/find-all-user-service.interface";
import type { DecodedUser } from "../../../auth/domain/dto/decoded-user.type";
import { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";

export function findAllUserController(service: FindAllUserServiceInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const {
          userid,
          pagination,
          search,
          company_id,
        }: {
          userid: string;
          pagination: PageOptionsDto;
          search: string;
          company_id?: string;
        } = req.body;
        const users = await service.run(
          userid,
          pagination,
          search,
          company_id,
        );

        res.status(200).json(users);
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
