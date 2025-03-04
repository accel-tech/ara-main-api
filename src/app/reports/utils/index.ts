import { ObjectId, UpdateFilter } from "mongodb";
import { IDepartment } from "../../../config/types/department";
import { IReport, Report } from "../../../config/types/report";
import ClientError from "../../../config/errors/ClientError";
import { Project } from "../../../config/types/project";
import { IMetric, Metric } from "../../../config/types/metrics";
import { ClientSession } from "mongoose";

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
  session: ClientSession,
  options?: {
    autoPopulateProjects?: boolean;
    autoPopulateCertifications?: boolean;
    autoPopulateMetrics?: boolean;
  }
) => {
  if (reportKind !== "r&d") throw new Error(`unexpected report type '${reportKind}'`);
  const reportId = new ObjectId();
  const reportTitle = data.title;

  let previousReport: IReport | null = null;
  let projects: IReport["projects"] = [];
  let certifications: IReport["certifications"] = [];
  let metrics: IReport["metrics"] = await createNewMetrics(
    {
      department: data.department,
      kind: reportKind,
      report: { _id: reportId, title: reportTitle }
    },
    session
  );

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
    const previousMetrics = await Metric.findOne(
      { "department._id": data.department._id, datePublished: { $exists: true }, kind: reportKind },
      { sort: { datePublished: -1 } }
    );
    if (previousMetrics) {
      await populateNewMetricsWithOldData(metrics._id, previousMetrics.data, session);
    }
  }

  return await Report.create({
    _id: reportId,
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
    overseer: project.overseer,
    writePolicy: project.writePolicy
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

async function createNewMetrics(
  args: Pick<IMetric, "kind" | "report" | "department">,
  session: ClientSession
): Promise<IReport["metrics"]> {
  if (args.kind !== "r&d") throw new Error(`Unexpected metric kind '${args.kind}'`);
  const metric = await Metric.create(
    {
      kind: args.kind,
      report: args.report,
      department: args.department,
      dateCreated: new Date(),
      data: {
        origins_cpu_used: 0,
        origins_cpu_available: 0,
        origins_memory_used: 0,
        origins_memory_available: 0,
        origins_ceph_used: 0,
        origins_ceph_available: 0,
        origins_pods: 0,
        origins_vms: 0,
        origins_downtime: 0,
        origins_outages: 0,
        origins_mean_recovery_time: 0,
        origins_node_status: "",
        origins_api_latency_internal: 0,
        origins_ingress_latency_internal: 0,
        origins_api_latency_external: 0,
        origins_ingress_latency_external: 0,
        //
        originsl1_cpu_used: 0,
        originsl1_cpu_available: 0,
        originsl1_memory_used: 0,
        originsl1_memory_available: 0,
        originsl1_flashsystem_used: 0,
        originsl1_flashsystem_available: 0,
        originsl1_pods: 0,
        originsl1_downtime: 0,
        originsl1_outages: 0,
        originsl1_mean_recovery_time: 0,
        originsl1_node_status: "",
        originsl1_api_latency_internal: 0,
        originsl1_ingress_latency_internal: 0,
        originsl1_api_latency_external: 0,
        originsl1_ingress_latency_external: 0,
        //
        ocp_cpu_used: 0,
        ocp_cpu_available: 0,
        ocp_memory_used: 0,
        ocp_memory_available: 0,
        ocp_ceph_used: 0,
        ocp_ceph_available: 0,
        ocp_pods: 0,
        ocp_vms: 0,
        //
        ceph_storage_used: 0,
        ceph_storage_available: 0,
        //
        flashsystem_storage_used: 0,
        flashsystem_storage_available: 0
      }
    },
    { session }
  );

  return { _id: metric._id };
}

async function populateNewMetricsWithOldData(
  newId: Object,
  oldData: IMetric["data"],
  session: ClientSession
) {
  const patchData: UpdateFilter<IMetric>["$set"] = {};
  const currentMetricKeys: Array<keyof IMetric["data"]> = [];

  for (const key of currentMetricKeys) {
    if (!oldData[key]) continue;
    patchData[`data.${key}`] = oldData[key];
  }

  const res = await Metric.updateOne({ _id: newId }, { $set: patchData }, { session });

  if (!res.acknowledged || res.matchedCount !== 1) {
    console.log(res);
    throw new Error("Failed to update new metrics with old data");
  }
}

export async function updateMetricStatus(
  id: ObjectId,
  status: "published" | "draft",
  session: ClientSession
) {}
