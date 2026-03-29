import { Request, Response } from "express";
import type { FindCompanyServiceInterface } from "../../domain/services/find-company-service.interface";

export function findCompanyController(service: FindCompanyServiceInterface) {
  return {
    run: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const company = await service.run(id);
        if (!company) {
          res.status(404).json({ message: "Company not found" });
          return;
        }
        res.status(200).json(company);
      } catch (error: any) {
        console.error("[FindCompanyController]", error);
        res.status(400).json({
          message: error.message ?? "Error finding company",
        });
      }
    },
  };
}
