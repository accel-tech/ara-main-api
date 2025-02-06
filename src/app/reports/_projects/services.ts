import ClientError from "../../../config/errors/ClientError";
import { IProject, Project } from "../../../config/types/project";
import { IReport, Report } from "../../../config/types/report";
import { reqUser } from "../../../config/types/request";
import assert from "assert";
import { validateAddProject } from "./validation";
import { ObjectId } from "mongodb";

export const addProject = async (report: IReport, data: unknown) => {
  if (report.status !== "draft") {
    throw new ClientError(`Can no longer edit report that is '${report.status}'`);
  }

  const fields = await validateAddProject(data);

  if (report.projects.some((pro) => pro._id.toString() === fields.projectId)) {
    throw new ClientError(`Project already included in Report`);
  }

  const project = await Project.findOne(
    { _id: new ObjectId(fields.projectId), "department._id": report.department._id },
    { projection: { _id: 1, title: 1, description: 1, overseer: 1 } }
  );

  if (!project) throw new ClientError(`Could not find project in this department`);

  const res = await Report.updateOne(
    { _id: report._id },
    {
      $push: {
        projects: {
          _id: project._id,
          title: project.title,
          description: project.description,
          overseer: project.overseer,
          tasks: []
        }
      }
    }
  );

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to add project to report");
  }

  return {
    _id: project._id,
    title: project.title,
    description: project.description,
    overseer: project.overseer,
    tasks: []
  };
};
