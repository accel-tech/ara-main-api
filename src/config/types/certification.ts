import { ObjectId } from "mongodb";
import { Doc } from "./doc";
import { getModel } from "../utils/mongo";

type GenericProps = {
  title: string;
  employee: { _id: ObjectId; name: string; email: string };
  department: { _id: ObjectId; title: string };
  dateAdded: Date;
  examCode?: string;
  examLink?: string;
};

interface Projected extends GenericProps, Doc {
  status: "projected";
  dateProjected: Date;
}

interface Completed extends GenericProps, Doc {
  status: "completed";
  dateCompleted: Date;
  dateProjected?: Date;
}

export type ICertification = Projected | Completed;

export const Certification = getModel<ICertification, ICertification>("certifications");
