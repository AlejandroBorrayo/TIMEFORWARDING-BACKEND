import { Schema, model, Document } from "mongoose";

export interface CompanyDocument extends Document {
  name: string;
  logo: string;
  deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
}

const CompanySchema = new Schema<CompanyDocument>(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, required: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const CompanyModel = model<CompanyDocument>(
  "Company",
  CompanySchema,
  "companies",
);
