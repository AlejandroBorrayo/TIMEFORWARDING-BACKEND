import { Schema, model, Document } from "mongoose";


export interface SupplierDocument extends Document {
  name: string;
  email?: string;
  phone?: string;
  deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
}


const SupplierSchema = new Schema<SupplierDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const SupplierModel = model<SupplierDocument>(
  "Supplier",
  SupplierSchema,
  "suppliers"
);