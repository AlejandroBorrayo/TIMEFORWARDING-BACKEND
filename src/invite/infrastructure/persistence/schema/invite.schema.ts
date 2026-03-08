import { Schema, model, Document } from "mongoose";

export interface InviteDocument extends Document {
  email: string;
  status: string;
  token: string;
  type: string;
  role: string;
  deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
}

const InviteSchema = new Schema<InviteDocument>(
  {
    email: { type: String, required: true },
    status: { type: String, required: true },
    token: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    type: { type: String, default: "invite" },
    role: { type: String, default: "seller" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const InviteModel = model<InviteDocument>(
  "Invite",
  InviteSchema,
  "invites"
);
