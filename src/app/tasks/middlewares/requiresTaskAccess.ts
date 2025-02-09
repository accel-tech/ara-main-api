import { ObjectId } from "mongodb";
import PermissionError from "../../../config/errors/PermissionError";
import { xRequestHandler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";
import assert from "assert";
import { Task } from "../../../config/types/task";
import { Project } from "../../../config/types/project";

export const requiresTaskAccess: xRequestHandler = async (req, res, next) => {
  const user = ensureValue(req.user);
  assert(user.role === "basic");

  if (user.role === "basic") {
    const document = await Task.findOne({
      _id: new ObjectId(ensureValue(req.params.id))
    });

    if (document) {
      let isAuthorized = false;

      // is department lead
      isAuthorized = user.departmentAccess.some(
        (dep) => dep._id.toString() === document.department._id.toString() && dep.access === "lead"
      );

      // he is author
      isAuthorized ||= document.addedBy._id.toString() === user._id.toString();

      // is project overseer
      isAuthorized ||= Boolean(
        await Project.findOne(
          { _id: document.project._id, "overseer._id": user._id },
          { projection: { _id: 1 } }
        )
      );

      if (isAuthorized) {
        req.document = { kind: "task", object: document };
        return next();
      }
    }
  }

  throw new PermissionError("You are not authorized to access this resource.", 403);
};
