import { Filter, ObjectId } from "mongodb";
import { reqUser } from "../../../config/types/request";
import { IMetric } from "../../../config/types/metrics";

export function processMetricFilters(initialFilters: Record<string, string>, user: reqUser) {
  const filter: Filter<IMetric> = { ...initialFilters };

  if (user.role === "basic") {
    filter.$or ??= [];
    // @ts-ignore
    filter.$or = [
      ...filter.$or!,
      ...user.departmentAccess.map((dep) => ({
        "department._id": dep._id
      }))
    ];
  }

  if (initialFilters.departmentId) {
    filter["department._id"] = new ObjectId(initialFilters.departmentId);
    delete filter.departmentId;
  }

  return filter;
}
