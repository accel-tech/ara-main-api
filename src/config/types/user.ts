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
}

export type IUser = Admin | Basic;

export const User = getModel<IUser, Admin | Basic>("users");
