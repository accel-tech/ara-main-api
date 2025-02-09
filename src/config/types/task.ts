import { ObjectId } from "mongodb";
import { getModel } from "../utils/mongo";
import { Doc } from "./doc";
import { IUser } from "./user";

export interface ITask extends Doc {
  text: string;
  dateAdded: Date;
  addedBy: Pick<IUser, "_id" | "name" | "email">;
  kind: "upcoming" | "completed" | "challenge" | "standby";
  project: {
    _id: ObjectId;
    title: string;
  };
  report: {
    _id: ObjectId;
    title: string;
  };
  department: {
    _id: ObjectId;
    title: string;
  };
}

export const Task = getModel<ITask, ITask>("tasks");
