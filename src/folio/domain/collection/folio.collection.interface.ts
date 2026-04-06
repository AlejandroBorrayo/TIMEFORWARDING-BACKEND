import { Schema, model, Types } from "mongoose";

export interface FolioCollectionInterface {
  _id?: string;
  seller_userid: Types.ObjectId;
  company_id?: Types.ObjectId | string;
  folio: string;
  service_cost: ServiceCostInterface[];
  deleted?: boolean;
  disabled?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface TaxInterface {
  name: string;
  amount: number;
}

export interface ItemInterface {
  name: string;
  description?: string;
  amount: number;
  usd_amount: number;
  currency: string;
  quantity: number;
  total:number
  tax: TaxInterface;
  supplier?: SupplierInterface;
}

export interface CustomerInterface {
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  company?: string;
  company_rfc?: string;
}

export interface SupplierInterface {
  _id?: Types.ObjectId;
  name: string;
  history:SupplierHistoryInterface[]
}

export interface SupplierHistoryInterface {
  _id?: Types.ObjectId;
  payment: number;
  status:string;
  currency:string;
  created_at?:Date
}



export interface CustomerPaymentHistoryInterface {
  _id?: Types.ObjectId;
  payment: number;
  status: string;
  currency: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface QuoteInterface {
  customer_id?: Types.ObjectId;
  pdf_url: string;
  no_quote: string;
  period_end_date?: Date;
  bill?: string;
  items: ItemInterface[];
  currency: string;
  notes?: string[];
  active: boolean;
  customer?: CustomerInterface;
  history?: CustomerPaymentHistoryInterface[];
  total: number;
  subtotal: number;
  tax: number;
  deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}


export interface ServiceCostInterface {
  _id?:string
  items: ItemInterface[];
  active:boolean
  no_service_cost:string
  total: number;
  currency: string;
  subtotal: number;
  tax: number;
  pdf_url: string;
  deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
  quotes: QuoteInterface[];

}


