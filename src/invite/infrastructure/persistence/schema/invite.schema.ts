import { Schema, model, Document, Types } from "mongoose";

export interface InviteDocument extends Document {
  email: string;
  name?: string;
  status: string;
  token: string;
  type: string;
  role: string;
  company_id?: Types.ObjectId;
  deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
}

const InviteSchema = new Schema<InviteDocument>(
  {
    email: { type: String, required: true },
    name: { type: String },
    status: { type: String, required: true },
    token: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    type: { type: String, default: "invite" },
    role: { type: String, default: "seller" },
    company_id: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      index: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const InviteModel = model<InviteDocument>(
  "Invite",
  InviteSchema,
  "invites"
);
