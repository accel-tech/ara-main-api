import { ObjectId } from "mongodb";
import PermissionError from "../../../config/errors/PermissionError";
import { Report } from "../../../config/types/report";
import { xRequestHandler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";
import { IUser } from "../../../config/types/user";

export const requiresReportAccess = (...access: Array<"member" | "lead" | "supervisor">) => {
  const handler: xRequestHandler = async (req, res, next) => {
    const user = ensureValue(req.user);
    if (user.role === "basic") {
      const report = await Report.findOne({
        _id: new ObjectId(ensureValue(req.params.id)),
        "department._id": {
          $in: user.departmentAccess
            .filter((dep) => access.includes(dep.access))
            .map((dep) => new ObjectId(dep._id))
        }
      });
      if (report) {
        req.document = { kind: "report", object: report };
        return next();
      }
    }

    throw new PermissionError("You are not authorized to access this resource.", 403);
  };

  return handler;
};
