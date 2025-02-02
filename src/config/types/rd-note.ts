import { ObjectId } from "mongodb";
import { IUser } from "./user";

export interface RDNote {
  _id: ObjectId;
  text: string;
  dateAdded: Date;
  addedBy: Pick<IUser, "_id" | "name" | "email">;
}
