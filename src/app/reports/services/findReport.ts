import { Filter, FindOptions, ObjectId } from "mongodb";
import ClientError from "../../../config/errors/ClientError";
import { reqUser } from "../../../config/types/request";
import { IReport } from "../../../config/types/report";
import { getReports } from "./getReports";

export const findReport = async (queryParams: Record<string, string>, user: reqUser) => {
  const departmentId = queryParams.departmentId;
  const reportId = queryParams.reportId;

  const afterDate = queryParams.afterDate;
  const beforeDate = queryParams.beforeDate;

  const filter: Filter<IReport> = {};
  const options: FindOptions = { limit: 1, sort: { dateCreated: -1 } };

  if (!departmentId) throw new ClientError(`Query parameter 'departmentId' must be provided`);
  filter["department._id"] = new ObjectId(departmentId);

  if (reportId) filter["_id"] = new ObjectId(reportId);

  if (beforeDate) {
    filter["coveringDates.from"] = { $lt: new Date(beforeDate) };
  }

  if (afterDate) {
    filter["coveringDates.to"] = { $gt: new Date(afterDate) };
  }

  const reports = await getReports(filter, options, user, true);

  return reports[0] || null;
};
