import { getModel } from "../utils/mongo";
import { Doc } from "./doc";
import { ICertification } from "./certification";
import { IDepartment } from "./department";
import { RDNote } from "./rd-note";
import { IProject } from "./project";
import { IMetric } from "./metrics";

interface RDReport {
  kind: "r&d";
  projects: Array<Pick<IProject, "_id" | "title" | "description" | "overseer" | "writePolicy">>;
  notes: Array<RDNote>;
  metrics: Pick<IMetric, "_id">;
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
