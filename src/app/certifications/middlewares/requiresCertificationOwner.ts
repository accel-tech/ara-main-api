import { ObjectId } from "mongodb";
import PermissionError from "../../../config/errors/PermissionError";
import { Certification } from "../../../config/types/certification";
import { xRequestHandler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";
import assert from "assert";

export const requiresCertificationOwner: xRequestHandler = async (req, res, next) => {
  const user = ensureValue(req.user);
  assert(user.role === "basic");

  if (user.role === "basic") {
    const document = await Certification.findOne({
      _id: new ObjectId(ensureValue(req.params.id)),
      $or: [
        // either the certification is part of a department where he is the lead
        {
          "department._id": {
            $in: user.departmentAccess.filter((dep) => dep.access === "lead").map((dep) => dep._id)
          }
        },
        // or it is his own certification
        { "employee._id": user._id }
      ]
    });
    if (document) {
      req.document = { kind: "certification", object: document };
      return next();
    }
  }

  throw new PermissionError("You are not authorized to access this resource.", 403);
};
