import { ObjectId } from "mongodb";
import PermissionError from "../../../config/errors/PermissionError";
import { Department } from "../../../config/types/department";
import { xRequestHandler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";

export const requiresDepartmentAccess = (...access: Array<"member" | "lead" | "supervisor">) => {
  const handler: xRequestHandler = async (req, res, next) => {
    const user = ensureValue(req.user);
    if (user.role === "basic") {
      const hasAccess = user.departmentAccess.some(
        (dep) => dep._id.toString() === req.params.id && access.includes(dep.access)
      );
      if (hasAccess) return next();
    }

    throw new PermissionError("You are not authorized to access this resource.", 403);
  };

  return handler;
};
