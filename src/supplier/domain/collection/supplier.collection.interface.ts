import { Types } from "mongoose";



export interface SupplierCollectionInterface {
  readonly _id?: Types.ObjectId;
  readonly name: string;
  readonly email?: string;
  readonly phone?: string;
  readonly deleted: boolean;
  readonly created_at?: Date;
  readonly updated_at?: Date;
}
