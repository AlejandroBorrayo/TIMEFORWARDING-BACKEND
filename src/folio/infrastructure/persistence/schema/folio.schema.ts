import { Schema, model, Types, Document } from "mongoose";

/* =======================
   Interfaces
======================= */

export interface TaxInterface {
  name: string;
  amount: number;
}

export interface SupplierInterface {
  _id: Types.ObjectId;
  name: string;
  history: SupplierHistoryInterface[];
}

export interface SupplierHistoryInterface {
  _id: Types.ObjectId;
  payment: number;
  status: string;
  currency: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ItemInterface {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  usd_amount?: number;
  quantity: number;
  total: number;
  tax?: TaxInterface;
  supplier?: SupplierInterface;
}

export interface CustomerPaymentHistoryInterface {
  _id: Types.ObjectId;
  payment: number;
  status: string;
  currency: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CustomerInterface {
  contact_name: string;
  contact_email?: string;
  contact_phone?: string;
  company: string;
  company_rfc?: string;
}

export interface QuoteInterface {
  customer_id?: Types.ObjectId;
  currency: string;
  pdf_url: string;
  no_quote: string;
  period_end_date?: Date;
  active: boolean;
  bill?: string;
  items: ItemInterface[];
  notes?: string[];
  customer: CustomerInterface;
  history?: CustomerPaymentHistoryInterface[];
  total: number;
  subtotal: number;
  tax?: number;
  deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface ServiceCostInterface {
  items: ItemInterface[];
  quotes: QuoteInterface[];
  no_service_cost: string;
  active: boolean;
  total: number;
  subtotal: number;
  tax?: number;
  currency: string;
  pdf_url: string;
  deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface FolioDocument extends Document {
  seller_userid: Types.ObjectId;
  folio: string;
  service_cost: ServiceCostInterface[];
  deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
}

/* =======================
   Schemas
======================= */

const TaxSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
});

const SupplierHistorySchema = new Schema(
  {
    payment: { type: Number, required: true },
    status: { type: String, required: true },
    currency: { type: String, required: true },
  },
  {
    _id: true,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

const SupplierSchema = new Schema(
  {
    name: { type: String, required: true },
    history: {
      type: [SupplierHistorySchema],
      default: [],
    },
  },
  { _id: true },
);

const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    currency: { type: String, required: true },
    description: String,
    amount: { type: Number, required: true },
    usd_amount: { type: Number, required: false },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    tax: { type: TaxSchema, required: false },
    supplier: {
      type: SupplierSchema,
      required: false,
    },
  },
  { _id: true },
);

const CustomerPaymentHistorySchema = new Schema(
  {
    payment: { type: Number, required: true },
    status: { type: String, required: true },
    currency: { type: String, required: true },
  },
  {
    _id: true,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

const CustomerSchema = new Schema(
  {
    contact_name: { type: String, required: false },
    contact_email: { type: String, required: false },
    contact_phone: { type: String, required: false },
    company: { type: String, required: false },
    company_rfc: { type: String, required: false },
  },
  { _id: false },
);

const QuoteSchema = new Schema(
  {
    customer_id: { type: Types.ObjectId },
    currency: { type: String, required: true },
    pdf_url: { type: String, required: true },
    no_quote: { type: String, required: true },
    period_end_date: { type: Date, required: false },
    active: { type: Boolean, default: false },
    bill: { type: String, required: false },
    items: { type: [ItemSchema], required: true },
    notes: [String],
    customer: { type: CustomerSchema, required: false },
    history: { type: [CustomerPaymentHistorySchema], default: [] },
    total: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: false },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

const ServiceCostSchema = new Schema(
  {
    items: { type: [ItemSchema], required: true },
    no_service_cost: { type: String, required: true },
    total: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    active: { type: Boolean, default: false },
    tax: { type: Number, required: false },
    currency: { type: String, required: true },
    pdf_url: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    quotes: {
      type: [QuoteSchema],
      default: [],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

/* =======================
   Folio
======================= */

const FolioSchema = new Schema<FolioDocument>(
  {
    seller_userid: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folio: {
      type: String,
      required: true,
      unique: true,
    },
    service_cost: {
      type: [ServiceCostSchema],
      default: [],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const FolioModel = model<FolioDocument>("Folio", FolioSchema);
