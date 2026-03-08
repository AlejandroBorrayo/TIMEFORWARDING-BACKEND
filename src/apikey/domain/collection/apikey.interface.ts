import { ObjectId } from 'mongodb';
//Guardará transacciones a wallet y envíos
export interface ApikeyCollectionInterface {
  _id: string;
  apikey: string;
  secret: string;
  created_at: Date;
  updated_at: Date;
}
