import { Schema, model, Document, Types } from "mongoose";

export interface TaxDocument extends Document {
  name: string;
  amount: number;
  deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
}

const NoteSchema = new Schema<TaxDocument>(
  {
    name: { type: String, required: true },
    amount: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const TaxModel = model<TaxDocument>("Tax", NoteSchema, "taxes");
