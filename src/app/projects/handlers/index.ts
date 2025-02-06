import { handler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";
import { httpHandler } from "../../../config/http/httpHandler";
import assert from "assert";
import { addProject } from "../services/addProject";
import { editProject } from "../services/editProject";
import { getProjects } from "../services/getProjects";

export class ProjectsHandler {
  @httpHandler("Get Reports")
  static getProjects: handler = async (req) => {
    return await getProjects(req.qFilter, req.qOptions, ensureValue(req.user));
  };

  @httpHandler("Add Project")
  static addProject: handler = async (req) => {
    return await addProject(ensureValue(req.body), ensureValue(req.user), ensureValue(req.session));
  };

  @httpHandler("Edit Project")
  static editProject: handler = async (req) => {
    assert(req.document?.kind === "project");
    return await editProject(
      ensureValue(req.document.object),
      ensureValue(req.body),
      ensureValue(req.session)
    );
  };
}
