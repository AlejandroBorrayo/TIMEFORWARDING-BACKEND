import { Request, Response } from "express";
import type { UpdateCompanyServiceInterface } from "../../domain/services/update-company-service.interface";
import type { UpdateCompanyDto } from "../../domain/dto/update-company.dto";

export function updateCompanyController(service: UpdateCompanyServiceInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const dto: UpdateCompanyDto = req.body;
        const company = await service.run(id, dto);
        res.status(200).json(company);
      } catch (error: any) {
        console.error("[UpdateCompanyController]", error);
        res.status(error.status ?? 400).json({
          message: error.message ?? "Error updating company",
        });
      }
    },
  };
}
