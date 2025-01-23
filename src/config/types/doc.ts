import { ObjectId } from "mongodb";

export type Doc = {
  _id: ObjectId;
  __v: number;
};
export type OptionalIdNoVersion<T> = Omit<T, "_id" | "__v"> & { _id?: ObjectId };
