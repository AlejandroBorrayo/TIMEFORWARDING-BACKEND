import { Request, Response } from "express";
import type { CreateCompanyServiceInterface } from "../../domain/services/create-company-service.interface";
import type { CreateCompanyDto } from "../../domain/dto/create-company.dto";

export function createCompanyController(service: CreateCompanyServiceInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const dto: CreateCompanyDto = req.body;
        const company = await service.run(dto);
        res.status(201).json(company);
      } catch (error: any) {
        console.error("[CreateCompanyController]", error);
        res.status(400).json({
          message: error.message ?? "Error creating company",
        });
      }
    },
  };
}
