import { ObjectId } from "mongodb";
import { IDepartment } from "../../../config/types/department";
import { IReport, Report } from "../../../config/types/report";
import ClientError from "../../../config/errors/ClientError";
import { Project } from "../../../config/types/project";

export function dateToWeekRange(date: Date): {
  startOfWeek: Date;
  endOfWeek: Date;
} {
  const startOfWeek = new Date(date);
  const endOfWeek = new Date(date);

  const dayOfWeek = startOfWeek.getDay();
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  endOfWeek.setDate(endOfWeek.getDate() + diffToMonday + 4);
  endOfWeek.setHours(23, 59, 59, 999);

  return {
    startOfWeek,
    endOfWeek
  };
}

export const newReport = async (
  reportKind: IDepartment["reportKind"],
  data: Pick<IReport, "title" | "coveringDates" | "department">,
  options?: {
    autoPopulateProjects?: boolean;
    autoPopulateCertifications?: boolean;
    autoPopulateMetrics?: boolean;
  }
) => {
  if (reportKind !== "r&d") throw new Error(`unexpected report type '${reportKind}'`);

  let previousReport: IReport | null = null;
  let projects: IReport["projects"] = [];
  let certifications: IReport["certifications"] = [];
  let metrics: IReport["metrics"] = getFreshMetrics();

  if (options?.autoPopulateProjects) {
    previousReport ??= await Report.findOne(
      { "department._id": data.department._id, status: "published" },
      { sort: { dateCreated: -1 } }
    );
    if (previousReport) projects = previousReport.projects;
  }
  if (options?.autoPopulateCertifications) {
    previousReport ??= await Report.findOne(
      { "department._id": data.department._id, status: "published" },
      { sort: { dateCreated: -1 } }
    );

    if (previousReport) {
      certifications = previousReport.certifications.filter((cert) => cert.status === "projected");
    }
  }
  if (options?.autoPopulateMetrics) {
    previousReport ??= await Report.findOne(
      { "department._id": data.department._id, status: "published" },
      { sort: { dateCreated: -1 } }
    );
    if (previousReport) metrics = previousReport.metrics;
  }

  return await Report.create({
    title: data.title,
    kind: reportKind,
    department: data.department,
    coveringDates: data.coveringDates,
    projects: projects,
    metrics: metrics,
    certifications: certifications,
    dateCreated: new Date(),
    status: "draft",
    notes: []
  });
};

export const autoPopulateReportProjects = async (
  departmentId: ObjectId
): Promise<(IReport & { kind: "r&d" })["projects"]> => {
  const activeProjects = await Project.find({ "department._id": departmentId, isActive: true });
  return activeProjects.map((project) => ({
    _id: project._id,
    title: project.title,
    description: project.description,
    overseer: project.overseer
  }));
};

export const validateReportCoveringDates = async (
  departmentId: ObjectId,
  coveringDates: { from: Date; to: Date },
  ignoreConflicts?: boolean
) => {
  if (coveringDates.from > coveringDates.to) {
    throw new ClientError("Report covering dates 'from' must be before 'to'");
  }
  // measure time if its too long?

  if (ignoreConflicts) return;

  const overlap = await Report.findOne(
    {
      "department._id": departmentId,
      $or: [
        { "coveringDates.from": { $gte: coveringDates.from, $lt: coveringDates.to } }, // starts between my start and end
        { "coveringDates.to": { $lt: coveringDates.to, $gte: coveringDates.from } }, // ends between my start and end
        {
          "coveringDates.from": { $lt: coveringDates.from },
          "coveringDates.to": { $gt: coveringDates.to }
        } // starts before and ends after my start and end
      ]
    },
    { projection: { _id: 1 } }
  );
  if (!overlap) return;
  throw new ClientError(`Report '${overlap._id}' already covering these dates`);
};

function getFreshMetrics(): IReport["metrics"] {
  return { origins_cpu: 0, origins_memory: 0 };
}
