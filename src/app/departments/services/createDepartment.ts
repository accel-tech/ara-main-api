import { Department } from "../../../config/types/department";
import { validateDepartmentTitle } from "../utils";
import { validateCreateDepartment } from "../validation/create";

export const createDepartment = async (data: unknown) => {
  const fields = await validateCreateDepartment(data);

  await validateDepartmentTitle(fields.title);

  const department = await Department.create({
    title: fields.title,
    reportKind: fields.reportKind,
    category: fields.category,
    dateCreated: new Date()
  });

  return department;
};
