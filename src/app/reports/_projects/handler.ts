import { handler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";
import { httpHandler } from "../../../config/http/httpHandler";
import assert from "assert";
import { addProject, removeProject } from "./services";

export class ReportProjectsHandler {
  @httpHandler("Add Report Project")
  static addProject: handler = async (req) => {
    assert(req.document?.kind === "report");
    return await addProject(ensureValue(req.document.object), ensureValue(req.body));
  };
  @httpHandler("Remove Report Project")
  static removeProject: handler = async (req) => {
    assert(req.document?.kind === "report");
    return await removeProject(ensureValue(req.params.projectId), ensureValue(req.document.object));
  };
}
