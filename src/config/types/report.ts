import { getModel } from "../utils/mongo";
import { Doc } from "./doc";
import { IRDProject, RDProjectData } from "./rd-project";
import { RDMetrics } from "./rd-metrics";
import { RDCertification } from "./rd-certification";
import { IDepartment } from "./department";
import { RDNote } from "./rd-note";

interface RDReport {
  kind: "r&d";
  projects: Array<Pick<IRDProject, "_id" | "title" | "description" | "overseer"> & RDProjectData>;
  notes: Array<RDNote>;
  metrics: RDMetrics;
  certifications: Array<RDCertification>;
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
