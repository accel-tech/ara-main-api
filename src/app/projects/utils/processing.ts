import { Filter, ObjectId } from "mongodb";
import { IReport } from "../../../config/types/report";
import { reqUser } from "../../../config/types/request";
import { IProject } from "../../../config/types/project";

export function processProjectFilters(initialFilters: Record<string, string>, user: reqUser) {
  const filter: Filter<IProject> = { ...initialFilters };

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
