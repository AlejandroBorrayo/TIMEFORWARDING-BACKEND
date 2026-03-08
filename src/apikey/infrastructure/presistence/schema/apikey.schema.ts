// src/modules/apikey/infrastructure/schemas/apikey.schema.ts
import { Schema, model, Document } from "mongoose";

export interface ApikeyDocument extends Document {
  apikey: string;
  secret: string;
  created_at?: Date;
  updated_at?: Date;
}

// Definición del Schema
const ApikeySchema = new Schema<ApikeyDocument>(
  {
    apikey: { type: String, required: true, unique: true, trim: true },
    secret: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);


export const ApikeyModel = model<ApikeyDocument>(
  "Apikey",
  ApikeySchema,
  "apikeys"
);
