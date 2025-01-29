import { Filter, FindOptions } from "mongodb";
import { IDepartment, Department } from "../../../config/types/department";

export const getDepartments = async (
  filter: Filter<IDepartment> = {},
  options: FindOptions = {}
) => {
  const departments = await Department.find(filter, options);

  return departments;
};
