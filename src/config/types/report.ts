import { getModel } from "../utils/mongo";
import { Doc } from "./doc";
import { IRDProject, RDProjectData } from "./rd-project";
import { IUser } from "./user";
import { RDMetrics } from "./rd-metrics";
import { RDCertifications } from "./rd-certification";
import { IDepartment } from "./department";
import { ObjectId } from "mongodb";

interface RDReport {
  kind: "r&d";
  projects: Array<Pick<IRDProject, "_id" | "title" | "description" | "overseer"> & RDProjectData>;
  notes: Array<{
    _id: ObjectId;
    text: string;
    dateAdded: Date;
    addedBy: Pick<IUser, "_id" | "name" | "email">;
  }>;
  metrics: RDMetrics;
  certifications: RDCertifications;
}

type ReportStatus = { status: "draft" } | { status: "published"; datePublished: Date };

interface GenericReport extends Doc {
  title: string;
  dateCreated: Date;
  coveringDates: { from: Date; to: Date };
  department: Pick<IDepartment, "_id" | "title">;
}

type IRDReport = RDReport & ReportStatus & GenericReport;
export type IReport = IRDReport;

export const Report = getModel<IReport, IReport>("reports");
