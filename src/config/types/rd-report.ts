import { getModel } from "../utils/mongo";
import { Doc } from "./doc";
import { IRDProject, RDProjectData } from "./rd-project";
import { IUser } from "./user";
import { RDMetrics } from "./rd-metrics";
import { RDCertifications } from "./rd-certification";

interface RDReport extends Doc {
  name: string;
  kind: "r&d";
  coveringDates: { from: Date; to: Date };
  datePublished?: Date;
  projects: Array<Pick<IRDProject, "_id" | "title" | "description" | "overseer"> & RDProjectData>;
  notes: Array<{
    text: string;
    dateAdded: Date;
    addedBy: Pick<IUser, "_id" | "name" | "email">;
  }>;
  metrics: RDMetrics;
  certifications: RDCertifications;
}

type IRDReport = RDReport;

export const ReportTemplate = getModel<IRDReport, IRDReport>("rd-reports");
