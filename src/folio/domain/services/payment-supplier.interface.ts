import { FolioCollectionInterface } from "../collection/folio.collection.interface";

export interface PaymentSupplierInterface {
  run(data: {
    payment: number;
    itemid: string;
    currency: string;
  }): Promise<{ message: string }>;
}
