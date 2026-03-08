import { Types } from "mongoose";



export interface TaxCollectionInterface {
  readonly _id?: Types.ObjectId;
  readonly name:string
  readonly amoun:number
  readonly deleted: boolean;
  readonly created_at?: Date;
  readonly updated_at?: Date;
}
