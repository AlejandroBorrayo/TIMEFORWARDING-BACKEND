import { Types } from "mongoose";



export interface NoteCollectionInterface {
  readonly _id?: Types.ObjectId;
  readonly note:string
  readonly deleted: boolean;
  readonly created_at?: Date;
  readonly updated_at?: Date;
}
