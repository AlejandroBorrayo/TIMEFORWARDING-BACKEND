import { Types } from "mongoose";



export interface TaxCollectionInterface {
  readonly _id?: Types.ObjectId;
  readonly name: string;
  readonly amount: number;
  readonly company_id?: Types.ObjectId | string;
  readonly deleted: boolean;
  readonly created_at?: Date;
  readonly updated_at?: Date;
}
