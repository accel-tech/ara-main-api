import { ObjectId } from "mongodb";
import PermissionError from "../../../config/errors/PermissionError";
import { xRequestHandler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";
import assert from "assert";
import { Metric } from "../../../config/types/metrics";

export const requiresCanEditMetric: xRequestHandler = async (req, res, next) => {
  const user = ensureValue(req.user);
  assert(user.role === "basic");

  if (user.role === "basic") {
    const document = await Metric.findOne({
      _id: new ObjectId(ensureValue(req.params.id)),
      $or: [
        // either the metric is part of a department where he is the lead
        {
          "department._id": {
            $in: user.departmentAccess.filter((dep) => dep.access === "lead").map((dep) => dep._id)
          }
        }
      ]
    });
    if (document) {
      req.document = { kind: "metric", object: document };
      return next();
    }
  }

  throw new PermissionError("You are not authorized to access this resource.", 403);
};
