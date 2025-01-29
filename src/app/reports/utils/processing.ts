import { Filter, ObjectId } from "mongodb";
import { IReport } from "../../../config/types/report";
import { reqUser } from "../../../config/types/request";

export function processReportFilters(initialFilters: Record<string, string>, user: reqUser) {
  const filter: Filter<IReport> = { ...initialFilters, $and: [] };

  if (user.role === "basic") {
    filter.$and = [
      ...filter.$and!,
      { "department._id": { $in: user.departmentAccess.map((dap) => dap._id) } }
    ];
  }

  if (initialFilters.departmentId) {
    filter["department._id"] = new ObjectId(initialFilters.departmentId);
    delete filter.departmentId;
  }

  if (initialFilters.date) {
    filter["coveringDates.from"] = { $gte: new Date(initialFilters.date) };
    filter["coveringDates.to"] = { $lte: new Date(initialFilters.date) };
    delete filter.date;
  }

  return filter;
}
