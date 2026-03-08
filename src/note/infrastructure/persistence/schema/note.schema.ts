import { Schema, model, Document, Types } from "mongoose";

export interface NoteDocument extends Document {
  note: string;
  deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
}

const NoteSchema = new Schema<NoteDocument>(
  {
    note: { type: String, required: true },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const NoteModel = model<NoteDocument>("Note", NoteSchema, "notes");
