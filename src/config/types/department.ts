import { getModel } from "../utils/mongo";
import { Doc } from "./doc";

export interface IDepartment extends Doc {
  title: string;
  dateCreated: Date;
  category: string;
  reportKind: "r&d" | "something-else";
}

export const Department = getModel<IDepartment, IDepartment>("departments");
