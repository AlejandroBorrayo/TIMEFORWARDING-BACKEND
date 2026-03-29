import type { PageOptionsDto } from "../../../shared/domain/pagination/page-meta-parameters";
import { UpdateQuery } from "mongoose";
import { FolioCollectionInterface } from "../collection/folio.collection.interface";

export interface FolioRepositoryInterface {
  create(
    service_cost: Partial<FolioCollectionInterface>
  ): Promise<FolioCollectionInterface>;

  updateById(
    _id: string,
    folio: UpdateQuery<FolioCollectionInterface>,
    options?: any
  ): Promise<FolioCollectionInterface | null>;

  findAll(data: {
    pagination: { page: number; perpage: number };
    folio?: string;
    customer?: string;
    seller_userid?: string;
    company_id?: string;
    start_date?: string | Date;
    end_date?: string | Date;
    supplier?: string;
  }): Promise<[FolioCollectionInterface[], number]>;
  findAllForReport(data: {
    folio?: string;
    seller_name?: string;
    no_quote?: number;
    customer?: string;
    seller_userid?: string;
    company_id?: string;
    start_date?: string | Date;
    end_date?: string | Date;
    supplier?: string;
  }): Promise<any[]>;
  findOne(_id?: string): Promise<FolioCollectionInterface | null>;
  findFolioByFolio(folio?: string): Promise<FolioCollectionInterface | null>;

  setActiveServiceCost(
    folioId: string,
    noServiceCost: string
  ): Promise<FolioCollectionInterface | null>;
  setActiveQuote(
    folioId: string,
    noQuote: string
  ): Promise<FolioCollectionInterface | null>;

  findSupplierHistory(supplierId: string): Promise<any[]>;
  paymentSupplier(data: {
    payment: number;
    itemid: string;
    currency: string;
  }): Promise<any[]>;
  cancelPaymentSupplier(data: {
    historyid: string;
    itemid: string;
  }): Promise<any[]>;
  findSuppliersByFolio(folio: string): Promise<any[]>;
  findActiveQuotesByCustomer(customerId: string, sellerId?: string): Promise<any[]>;
  paymentCustomer(data: {
    payment: number;
    quoteid: string;
    currency: string;
  }): Promise<any>;
  cancelPaymentCustomer(data: {
    historyid: string;
    quoteid: string;
  }): Promise<any>;
  findCustomerHistory(customerId: string): Promise<any[]>;
}
