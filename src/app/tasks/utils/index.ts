import { ObjectId } from "mongodb";
import ClientError from "../../../config/errors/ClientError";
import { Report } from "../../../config/types/report";
import { reqUser } from "../../../config/types/request";
import PermissionError from "../../../config/errors/PermissionError";
import { Project } from "../../../config/types/project";

export const validateReportTaskWritable = async (args: {
  reportId: string;
  departmentAccess: (reqUser & { role: "basic" })["departmentAccess"];
  projectId: string;
}) => {
  const report = await Report.findOne(
    { _id: new ObjectId(args.reportId) },
    { projection: { _id: 1, status: 1, department: 1, "projects._id": 1 } }
  );
  if (!report) throw new ClientError(`Report not found`);

  if (!report.projects.some((pro) => pro._id.toString() === args.projectId)) {
    throw new ClientError(`Project is not included in this report`);
  }

  if (report.status !== "draft") {
    throw new ClientError(`Cannot write to report that is '${report.status}'`);
  }
  if (
    !args.departmentAccess.some(
      (dep) =>
        dep._id.toString() === report.department._id.toString() &&
        ["lead", "member"].includes(dep.access)
    )
  ) {
    throw new PermissionError(`No write access to department '${report.department.title}'`);
  }

  return {
    _id: report._id,
    title: report.title,
    department: { _id: report.department._id, title: report.department.title }
  };
};

export const validateProjectTaskWritable = async (args: {
  projectId: string;
  userId: ObjectId;
  departmentAccess: (reqUser & { role: "basic" })["departmentAccess"];
}) => {
  const project = await Project.findOne(
    { _id: new ObjectId(args.projectId) },
    { projection: { _id: 1, overseer: 1 } }
  );

  if (!project) throw new ClientError(`Project not found`);

  let isAuthorized = false;

  // he is project overseer
  isAuthorized = args.userId.toString() === project.overseer._id.toString();

  if (!isAuthorized) {
    // he is department lead
    isAuthorized = args.departmentAccess.some(
      (dep) => dep._id.toString() === project.department._id.toString() && dep.access === "lead"
    );
  }

  if (!isAuthorized) {
    throw new PermissionError(`No write access to project '${project.title}'`);
  }

  return { _id: project._id, title: project.title };
};
