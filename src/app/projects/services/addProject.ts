import { ClientSession } from "mongoose";
import { reqUser } from "../../../config/types/request";
import { validateAddProject } from "../validation/add";
import assert from "assert";
import { addProjectToLatestReport, validateOverseerId, validateProjectTitle } from "../utils";
import PermissionError from "../../../config/errors/PermissionError";
import { Project } from "../../../config/types/project";

export const addProject = async (data: unknown, user: reqUser, session: ClientSession) => {
  const fields = await validateAddProject(data);

  assert(user.role === "basic");

  const departmentAccess = user.departmentAccess.find(
    (dep) => dep._id.toString() === fields.departmentId
  );

  if (!departmentAccess || !["lead"].includes(departmentAccess.access)) {
    throw new PermissionError("You do not have access to this deparment");
  }

  const project = await Project.create(
    {
      title: await validateProjectTitle(fields.title, fields.departmentId),
      description: fields.description,
      overseer: await validateOverseerId(fields.overseerId),
      department: { _id: departmentAccess._id, title: departmentAccess.title },
      isActive: true,
      dateCreated: new Date(),
      writePolicy: fields.writePolicy
    },
    { session }
  );

  await addProjectToLatestReport(project, session);

  return project;
};
