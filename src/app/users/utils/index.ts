import { ObjectId } from "mongodb";
import { Department } from "../../../config/types/department";
import { IUser, User } from "../../../config/types/user";
import ClientError from "../../../config/errors/ClientError";

export const validateEditDepartmentAccess = async (
  userId: ObjectId,
  values: {
    _id: string;
    title?: string;
    category?: string;
    access: "member" | "lead";
  }[]
) => {
  const validatedDepartmentAccess: (IUser & { role: "basic" })["departmentAccess"] = [];
  const involvedDepartments = await Department.find({
    _id: { $in: values.map((val) => new ObjectId(val._id)) }
  });

  for (const value of values) {
    const department = involvedDepartments.find((dep) => dep._id.toString() === value._id);
    if (!department) {
      throw new ClientError(`Department '${value._id}' not found`);
    }

    if (value.title && value.title !== department.title) {
      throw new ClientError(`Department title '${value.title}' not matching department title`);
    }

    if (value.category && value.category !== department.category) {
      throw new ClientError(
        `Department category '${value.category}' not matching department category`
      );
    }

    if (value.access === "lead") {
      const duplicateLead = await User.findOne(
        {
          _id: { $ne: userId },
          role: "basic",
          departmentAccess: { $elemMatch: { _id: department._id, role: "lead" } }
        },
        { projection: { _id: 1, name: 1 } }
      );
      if (duplicateLead) {
        throw new ClientError(
          `Department '${department._id}' already has a lead (${duplicateLead.name})`
        );
      }
    }

    validatedDepartmentAccess.push({
      _id: department._id,
      title: department.title,
      category: department.category,
      access: value.access
    });
  }

  return validatedDepartmentAccess;
};
