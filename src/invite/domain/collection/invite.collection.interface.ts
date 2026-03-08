import { Types } from "mongoose";
//Guardará transacciones a wallet y envíos
export interface InviteCollectionInterface {
  _id: Types.ObjectId;
  email: string;
  name:string
  status: string;
  token: string;
  type: string;
  deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
}
