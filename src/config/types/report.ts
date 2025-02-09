import { getModel } from "../utils/mongo";
import { Doc } from "./doc";

import { RDMetrics } from "./rd-metrics";
import { ICertification } from "./certification";
import { IDepartment } from "./department";
import { RDNote } from "./rd-note";
import { IProject } from "./project";
import { IUser } from "./user";
import { ObjectId } from "mongodb";

interface RDReport {
  kind: "r&d";
  projects: Array<Pick<IProject, "_id" | "title" | "description" | "overseer">>;
  notes: Array<RDNote>;
  metrics: RDMetrics;
  certifications: Array<Omit<ICertification, "__v" | "department">>;
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
