import { ObjectId } from "mongodb";
import { getModel } from "../utils/mongo";
import { Doc } from "./doc";
import { IUser } from "./user";

export interface IProject extends Doc {
  title: string;
  description: string;
  dateCreated: Date;
  isActive: boolean;
  overseer: {
    _id: ObjectId;
    name: string;
    email: string;
  };
  department: {
    _id: ObjectId;
    title: string;
  };
  dateClosed?: Date;
  writePolicy: "overseerOnly" | "allDepartment";
  // additionalWriters?: { _id: ObjectId; name: string; email: string }[];
}

export const Project = getModel<IProject, IProject>("projects");
