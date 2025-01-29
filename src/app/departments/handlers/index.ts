import { ObjectId } from "mongodb";
import { handler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";
import NotFoundError from "../../../config/errors/NotFoundError";
import { httpHandler } from "../../../config/http/httpHandler";
import { getDepartments } from "../services/getDepartments";

import { editDepartment } from "../services/editDepartment";
import { createDepartment } from "../services/createDepartment";

export class DepartmentHandlers {
  @httpHandler("Get Departments")
  static getDepartments: handler = async (req) => {
    const user = ensureValue(req.user);
    return await getDepartments(req.qFilter, req.qOptions);
  };

  @httpHandler("Get Department")
  static getDepartment: handler = async (req) => {
    const departments = await getDepartments(
      { _id: new ObjectId(ensureValue(req.params.id)) },
      { ...req.qOptions, limit: 1 }
    );

    if (!departments[0]) throw new NotFoundError(`Department ${req.params.id} not found`);

    return departments[0];
  };

  @httpHandler("Create Department", 201)
  static createDepartment: handler = async (req) => {
    return await createDepartment(req.body);
  };

  @httpHandler("Edit Department", 202)
  static editDepartment: handler = async (req) => {
    return await editDepartment(ensureValue(req.params.id), req.body);
  };
}
