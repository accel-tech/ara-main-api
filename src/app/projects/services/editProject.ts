import { ClientSession } from "mongoose";
import { reqUser } from "../../../config/types/request";
import { UpdateFilter } from "mongodb";
import { updateLatestReportOnProjectPatch, validateOverseerId } from "../utils";
import { validateEditProject } from "../validation/edit";
import { IProject, Project } from "../../../config/types/project";

export const editProject = async (project: IProject, data: unknown, session: ClientSession) => {
  const fields = await validateEditProject(data);

  const patchData: UpdateFilter<IProject> = { $set: {}, $unset: {} };

  if (fields.title && fields.title !== project.title) {
    patchData.$set = { ...patchData.$set, title: fields.title };
  }

  if (fields.description && fields.description !== project.description) {
    patchData.$set = { ...patchData.$set, description: fields.description };
  }
  if (fields.overseerId && fields.overseerId !== project.overseer._id.toString()) {
    patchData.$set = { ...patchData.$set, overseer: await validateOverseerId(fields.overseerId) };
  }

  if (typeof fields.isActive === "boolean") {
    patchData.$set = { ...patchData.$set, isActive: fields.isActive };
  }

  if (!Object.keys(patchData.$set!).length && !Object.keys(patchData.$unset!).length) {
    return project;
  }

  const res = await Project.updateOne({ _id: project._id }, patchData, { session });

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to edit project");
  }

  await updateLatestReportOnProjectPatch(project._id, patchData, session);

  return project;
};
