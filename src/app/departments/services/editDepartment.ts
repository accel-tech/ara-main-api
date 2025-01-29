import { ObjectId, UpdateFilter } from "mongodb";
import { Department, IDepartment } from "../../../config/types/department";
import ClientError from "../../../config/errors/ClientError";
import { validateEditDepartment } from "../validation/edit";
import { ClientSession } from "mongoose";
import { validateDepartmentTitle } from "../utils";

export const editDepartment = async (id: string, data: unknown) => {
  const department = await Department.findOne({ _id: new ObjectId(id) });
  if (!department) throw new ClientError(`Department ${id} not found`);

  const fields = await validateEditDepartment(data);
  const changes: UpdateFilter<IDepartment> = { $set: {}, $unset: {}, $push: {} };

  if (fields.title && fields.title !== department.title) {
    await validateDepartmentTitle(fields.title);
    changes.$set = { ...changes.$set, title: fields.title };
  }

  if (fields.category && fields.category !== department.category) {
    changes.$set = { ...changes.$set, category: fields.category };
  }

  if (fields.reportKind && fields.reportKind !== department.reportKind) {
    changes.$set = { ...changes.$set, reportKind: fields.reportKind };
  }

  const res = await Department.updateOne({ _id: new ObjectId(id) }, changes);

  if (!res.acknowledged || res.modifiedCount !== 1) throw new Error(`How`);

  return fields;
};
