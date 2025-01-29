import { ObjectId } from "mongodb";

export type RDCertifications = {
  completed: Array<{
    title: string;
    author: { _id: ObjectId; name: string; email: string };
    dateCompleted: Date;
    dateAdded: Date;
    link?: string;
    dateProjected?: Date;
  }>;
  projected: Array<{
    title: string;
    author: { _id: ObjectId; name: string; email: string };
    dateProjected: Date;
    dateAdded: Date;
    link?: string;
  }>;
};
