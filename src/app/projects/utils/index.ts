import { ObjectId, UpdateFilter } from "mongodb";
import ClientError from "../../../config/errors/ClientError";
import { User } from "../../../config/types/user";
import { ICertification } from "../../../config/types/certification";
import { ClientSession } from "mongoose";
import { IReport, Report } from "../../../config/types/report";
import { IProject, Project } from "../../../config/types/project";

export const validateOverseerId = async (id: string) => {
  const user = await User.findOne(
    { _id: new ObjectId(id) },
    { projection: { _id: 1, name: 1, email: 1 } }
  );
  if (user) return { _id: user._id, name: user.name, email: user.email };

  throw new ClientError(`Could not find user '${id}'`);
};

export const validateProjectTitle = async (title: string, departmentId: string) => {
  const project = await Project.findOne(
    {
      title: title,
      "department._id": new ObjectId(departmentId)
    },
    { projection: { _id: 1 } }
  );

  if (project) throw new ClientError(`Project 'title' already used in this department`);

  return title;
};

export const addProjectToLatestReport = async (project: IProject, session: ClientSession) => {
  const latestReport = await Report.findOne(
    { status: "draft", "department._id": project.department._id },
    { sort: { dateCreated: -1 }, projection: { _id: 1 } }
  );

  if (!latestReport) return;

  const rdproject = {
    _id: project._id,
    title: project.title,
    description: project.title,
    overseer: project.overseer
  };

  const res = await Report.updateOne(
    { _id: latestReport._id },
    { $push: { projects: rdproject } },
    { session }
  );

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to add project to report");
  }
};

export const updateLatestReportOnProjectPatch = async (
  projectId: ObjectId,
  patch: UpdateFilter<ICertification>,
  session: ClientSession
) => {
  const latestReport = await Report.findOne(
    { status: "draft", "projects._id": projectId },
    { sort: { dateCreated: -1 }, projection: { _id: 1 } }
  );

  if (!latestReport) return;

  const localPatch: UpdateFilter<IReport> = {
    $set: Object.keys(patch.$set || {}).reduce(
      (acc, currentKey) => {
        acc[`projects.$[element].${currentKey}`] = (patch.$set || {})[currentKey];
        return acc;
      },
      {} as NonNullable<UpdateFilter<IReport>["$set"]>
    ),
    $unset: Object.keys(patch.$unset || {}).reduce(
      (acc, currentKey) => {
        acc[`projects.$[element].${currentKey}`] = (patch.$unset || {})[currentKey];
        return acc;
      },
      {} as NonNullable<UpdateFilter<IReport>["$unset"]>
    )
  };

  const res = await Report.updateOne({ _id: latestReport._id }, localPatch, {
    session,
    arrayFilters: [{ "element._id": projectId }]
  });

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to update project on report");
  }
};

// export const removeCertificationFromLatestReport = async (
//   certificationId: ObjectId,
//   session: ClientSession
// ) => {
//   const res = await Report.updateOne(
//     { status: "draft", "certifications._id": certificationId },
//     { $pull: { certifications: { _id: certificationId } } },
//     { session }
//   );

//   if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
//     throw new Error("Failed to remove certification to report");
//   }
// };
