import { ObjectId } from "mongodb";
import { Department } from "../../../config/types/department";
import { validateCreateReport } from "../validation/create";
import ClientError from "../../../config/errors/ClientError";
import { reqUser } from "../../../config/types/request";
import PermissionError from "../../../config/errors/PermissionError";
import { newReport, validateReportCoveringDates } from "../utils";

export const createReport = async (data: unknown, user: reqUser) => {
  const fields = await validateCreateReport(data);

  const department = await Department.findOne({ _id: new ObjectId(fields.departmentId) });
  if (!department) throw new ClientError(`Department '${fields.departmentId}' not found`);

  if (user.role !== "basic") {
    throw new PermissionError(`Reports cannot be created by' ${user.role}'`);
  }

  if (
    !user.departmentAccess.some(
      (dep) => dep._id.toString() === department._id.toString() && dep.access === "lead"
    )
  ) {
    throw new PermissionError(`Reports may only be created by department leads`);
  }

  await validateReportCoveringDates(
    department._id,
    fields.coveringDates,
    fields.options?.ignoreDateConflicts
  );

  const report = await newReport(
    department.reportKind,
    {
      title: fields.title,
      coveringDates: fields.coveringDates,
      department: { _id: department._id, title: department.title }
    },
    fields.options
  );

  return report;
};
