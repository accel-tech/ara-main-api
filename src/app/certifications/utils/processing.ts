import { Filter, ObjectId } from "mongodb";
import { reqUser } from "../../../config/types/request";
import { ICertification } from "../../../config/types/certification";

export function processCertificationFilters(initialFilters: Record<string, string>, user: reqUser) {
  const filter: Filter<ICertification> = { ...initialFilters };

  if (user.role === "basic") {
    filter.$or ??= [];
    // @ts-ignore
    filter.$or = [
      ...filter.$or!,
      ...user.departmentAccess.map((dep) => ({
        "department._id": dep._id,
        "employee._id": dep.access === "lead" ? { $exists: true } : new ObjectId(user._id)
      }))
    ];
  }

  if (initialFilters.departmentId) {
    filter["department._id"] = new ObjectId(initialFilters.departmentId);
    delete filter.departmentId;
  }

  return filter;
}
