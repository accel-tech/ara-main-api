import ClientError from "../../../config/errors/ClientError";
import { Department } from "../../../config/types/department";

export const validateDepartmentTitle = async (title: string) => {
  const duplicateName = await Department.findOne({ title: title }, { projection: { _id: 1 } });
  if (!duplicateName) return;
  throw new ClientError(`Department title '${title}' already used`);
};
