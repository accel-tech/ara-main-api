import { ObjectId } from "mongodb";

type GenericProps = {
  _id: ObjectId;
  title: string;
  examCode?: string;
  examLink?: string;
  employee: { _id: ObjectId; name: string; email: string };
  dateAdded: Date;
};

interface Projected extends GenericProps {
  status: "projected";
  dateProjected: Date;
}

interface Completed extends GenericProps {
  status: "completed";
  dateCompleted: Date;
  dateProjected?: Date;
}

export type RDCertification = Projected | Completed;
