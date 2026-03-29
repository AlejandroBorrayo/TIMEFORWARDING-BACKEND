import { Schema, model, Document, Types } from "mongoose";

export interface ContactDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CustomerDocument extends Document {
  contacts: ContactDocument[];
  company: string;
  company_rfc?: string;
  company_id?: Types.ObjectId;
  creator_userid: Types.ObjectId;
  deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
}

const ContactSchema = new Schema<ContactDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const CustomerSchema = new Schema<CustomerDocument>(
  {
    contacts: { type: [ContactSchema], required: true },
    company: { type: String, required: true },
    company_rfc: { type: String, required: false },
    creator_userid: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company_id: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      index: true,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const CustomerModel = model<CustomerDocument>(
  "Customer",
  CustomerSchema,
  "customers"
);