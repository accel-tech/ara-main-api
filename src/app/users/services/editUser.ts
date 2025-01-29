import { ObjectId, UpdateFilter } from "mongodb";
import { User, IUser } from "../../../config/types/user";
import ClientError from "../../../config/errors/ClientError";
import { validateEditUser } from "../validation/edit";
import { ClientSession } from "mongoose";
import { validateEditDepartmentAccess } from "../utils";

export const editUser = async (id: string, data: unknown) => {
  const user = await User.findOne({ _id: new ObjectId(id) });
  if (!user) throw new ClientError(`User ${id} not found`);
  if (user.role !== "basic") throw new ClientError(`Cannot edit '${user.role}' user`);

  const fields = await validateEditUser(data);
  const changes: UpdateFilter<IUser> = { $set: {}, $unset: {}, $push: {} };

  if (fields.departmentAccess) {
    changes.$set = {
      ...changes.$set,
      departmentAccess: await validateEditDepartmentAccess(user._id, fields.departmentAccess)
    };
  }

  const res = await User.updateOne({ _id: new ObjectId(id) }, changes);

  if (!res.acknowledged || res.modifiedCount !== 1) throw new Error(`How`);

  return fields;
};
