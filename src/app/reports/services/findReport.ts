import { Filter, FindOptions, ObjectId } from "mongodb";
import ClientError from "../../../config/errors/ClientError";
import { reqUser } from "../../../config/types/request";
import { IReport } from "../../../config/types/report";
import { getReports } from "./getReports";

export const findReport = async (queryParams: Record<string, string>, user: reqUser) => {
  const departmentId = queryParams.departmentId;
  const date = queryParams.date;

  const filter: Filter<IReport> = {};
  const options: FindOptions = {};

  if (!departmentId) throw new ClientError(`Query parameter 'departmentId' must be provided`);
  filter["department._id"] = new ObjectId(departmentId);

  if (date) {
    filter["coveringDates.from"] = { $gte: new Date(date) };
    filter["coveringDates.to"] = { $lte: new Date(date) };
  } else {
    // just get the latest
    options.sort = { dateCreated: -1 };
  }

  const reports = await getReports(filter, options, user, true);

  return reports[0] || null;
};
