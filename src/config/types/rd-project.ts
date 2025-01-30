import { ObjectId } from "mongodb";
import { getModel } from "../utils/mongo";
import { Doc } from "./doc";
import { IUser } from "./user";

export type RDProjectData = {
  completedTasks: Array<{
    text: string;
    dateAdded: Date;
    addedBy: Pick<IUser, "_id" | "name" | "email">;
  }>;
  upcomingTasks: Array<{
    text: string;
    dateAdded: Date;
    addedBy: Pick<IUser, "_id" | "name" | "email">;
  }>;
  particularChallenges: Array<{
    text: string;
    dateAdded: Date;
    addedBy: Pick<IUser, "_id" | "name" | "email">;
  }>;
  issuesOnStandby: Array<{
    text: string;
    dateAdded: Date;
    addedBy: Pick<IUser, "_id" | "name" | "email">;
  }>;
};

export interface IRDProject extends Doc {
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
}

export const RDProject = getModel<IRDProject, IRDProject>("rd-projects");
