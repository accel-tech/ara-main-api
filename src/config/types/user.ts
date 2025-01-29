import { ObjectId } from "mongodb";
import { getModel } from "../utils/mongo";
import { Doc } from "./doc";

interface BaseUser extends Doc {
  name: string;
  email: string;
  keycloakId: string;
  dateCreated: Date;
  isActive: boolean;
}

interface Admin extends BaseUser {
  role: "admin";
}

interface Basic extends BaseUser {
  role: "basic";
  departmentAccess: {
    _id: ObjectId;
    title: string;
    category: string;
    access: "member" | "lead";
  }[];
}

export type IUser = Admin | Basic;

export const User = getModel<IUser, Admin | Basic>("users");
