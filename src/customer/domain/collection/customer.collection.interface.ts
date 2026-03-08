import { Types } from "mongoose";

export interface ContactInterface {
  readonly _id?: Types.ObjectId;
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly deleted: boolean;
  readonly created_at?: Date;
  readonly updated_at?: Date;
}

export interface CustomerCollectionInterface {
  readonly _id?: Types.ObjectId;
  readonly contacts: ContactInterface[];
  readonly company: string;
  readonly company_rfc?: string;
  readonly creator_userid: Types.ObjectId;
  readonly deleted: boolean;
  readonly created_at?: Date;
  readonly updated_at?: Date;
}
