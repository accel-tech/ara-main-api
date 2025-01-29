import { ObjectId } from "mongodb";
import { handler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";
import NotFoundError from "../../../config/errors/NotFoundError";
import { httpHandler } from "../../../config/http/httpHandler";
import { getUsers } from "../services/getUsers";
import { editUser } from "../services/editUser";

export class UserHandlers {
  @httpHandler("Get Users")
  static getUsers: handler = async (req) => {
    const user = ensureValue(req.user);
    return await getUsers(req.qFilter, req.qOptions);
  };

  @httpHandler("Get User")
  static getUser: handler = async (req) => {
    const users = await getUsers(
      { _id: new ObjectId(ensureValue(req.params.id)) },
      { ...req.qOptions, limit: 1 }
    );

    if (!users[0]) throw new NotFoundError(`User ${req.params.id} not found`);

    return users[0];
  };

  @httpHandler("Edit User", 202)
  static editUser: handler = async (req) => {
    return await editUser(ensureValue(req.params.id), req.body);
  };
}
