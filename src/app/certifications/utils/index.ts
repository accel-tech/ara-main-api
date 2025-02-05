import { ObjectId, UpdateFilter } from "mongodb";
import ClientError from "../../../config/errors/ClientError";
import { User } from "../../../config/types/user";
import { ICertification } from "../../../config/types/certification";
import { ClientSession } from "mongoose";
import { IReport, Report } from "../../../config/types/report";

export const validateEmployeeId = async (id: string) => {
  const user = await User.findOne(
    { _id: new ObjectId(id) },
    { projection: { _id: 1, name: 1, email: 1 } }
  );
  if (user) return { _id: user._id, name: user.name, email: user.email };

  throw new ClientError(`Could not find user '${id}'`);
};

export const addCertificationToLatestReport = async (
  certification: ICertification,
  session: ClientSession
) => {
  const latestReport = await Report.findOne(
    { status: "draft", "department._id": certification.department._id },
    { sort: { dateCreated: -1 }, projection: { _id: 1 } }
  );

  if (!latestReport) return;

  const rdcertification = { ...certification, department: undefined, __v: undefined };

  const res = await Report.updateOne(
    { _id: latestReport._id },
    { $push: { certifications: rdcertification } },
    { session }
  );

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to add certification to report");
  }
};

export const updateLatestReportOnCertificationPatch = async (
  certificationId: ObjectId,
  patch: UpdateFilter<ICertification>,
  session: ClientSession
) => {
  const latestReport = await Report.findOne(
    { status: "draft", "certifications._id": certificationId },
    { sort: { dateCreated: -1 }, projection: { _id: 1 } }
  );

  if (!latestReport) return;

  const localPatch: UpdateFilter<IReport> = {
    $set: Object.keys(patch.$set || {}).reduce(
      (acc, currentKey) => {
        acc[`certifications.$[element].${currentKey}`] = (patch.$set || {})[currentKey];
        return acc;
      },
      {} as NonNullable<UpdateFilter<IReport>["$set"]>
    ),
    $unset: Object.keys(patch.$unset || {}).reduce(
      (acc, currentKey) => {
        acc[`certifications.$[element].${currentKey}`] = (patch.$unset || {})[currentKey];
        return acc;
      },
      {} as NonNullable<UpdateFilter<IReport>["$unset"]>
    )
  };

  console.log(localPatch);

  const res = await Report.updateOne({ _id: latestReport._id }, localPatch, {
    session,
    arrayFilters: [{ "element._id": certificationId }]
  });

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to update certification on report");
  }
};

export const removeCertificationFromLatestReport = async (
  certificationId: ObjectId,
  session: ClientSession
) => {
  const res = await Report.updateOne(
    { status: "draft", "certifications._id": certificationId },
    { $pull: { certifications: { _id: certificationId } } },
    { session }
  );

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to remove certification to report");
  }
};
