export interface SupplierHistoryItem {
    folio: string;
    service_cost_id: string;
    no_service_cost: string;
    item: ItemDetail;
    supplier: Supplier;
  }
  
  export interface ItemDetail {
    name: string;
    currency: string;
    description: string;
    amount: number;
    usd_amount: number;
    quantity: number;
    tax: Tax;
    supplier: Supplier;
  }
  
  export interface Tax {
    _id: string;
    name: string;
    amount: number;
  }
  
  export interface Supplier {
    _id: string;
    name: string;
    paid: number;
    pending: number;
    total: number;
    history: SupplierHistory[];
  }
  
  export interface SupplierHistory {
    folio: string;
    service_cost_id: string;
    no_service_cost: string;
    amount: number;
    currency: string;
    created_at?: Date;
  }
  