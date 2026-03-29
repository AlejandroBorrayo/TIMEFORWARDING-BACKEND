import { Request, Response } from "express";
import type { FindAllCompanyServiceInterface } from "../../domain/services/find-all-company-service.interface";
import type { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";

export function findAllCompanyController(
  service: FindAllCompanyServiceInterface,
) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const dto: {
          pagination: PageOptionsDto;
          search?: string;
        } = req.body;
        const result = await service.run(dto.pagination, dto?.search);
        res.status(200).json(result);
      } catch (error: any) {
        console.error("[FindAllCompanyController]", error);
        res.status(400).json({
          message: error.message ?? "Error listing companies",
        });
      }
    },
  };
}
