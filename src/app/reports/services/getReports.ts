import { Filter, FindOptions } from "mongodb";
import { IReport, Report } from "../../../config/types/report";
import { reqUser } from "../../../config/types/request";
import { processReportFilters } from "../utils/processing";

export const getReports = async (
  filter: Filter<IReport> = {},
  options: FindOptions = {},
  user: reqUser
) => {
  const reports = await Report.find(processReportFilters(filter, user), options);

  return reports;
};
