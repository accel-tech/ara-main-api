import { ClientSession } from "mongoose";
import { reqUser } from "../../../config/types/request";
import { UpdateFilter } from "mongodb";
import { updateLatestReportOnCertificationPatch } from "../utils";
import { Certification, ICertification } from "../../../config/types/certification";
import { validateEditCertification } from "../validation/edit";

export const editCertification = async (
  certification: ICertification,
  data: unknown,
  user: reqUser,
  session: ClientSession
) => {
  const fields = await validateEditCertification(data, certification.status);

  const patchData: UpdateFilter<ICertification> = { $set: {}, $unset: {} };
  console.log(fields);

  if (fields.title && fields.title !== certification.title) {
    patchData.$set = { ...patchData.$set, title: fields.title };
  }

  if (fields.examCode && fields.examCode !== certification.examCode) {
    patchData.$set = { ...patchData.$set, examCode: fields.examCode };
  }
  if (fields.examLink && fields.examLink !== certification.examLink) {
    patchData.$set = { ...patchData.$set, examLink: fields.examLink };
  }

  if (fields.status && fields.status !== certification.status) {
    patchData.$set = { ...patchData.$set, status: fields.status };
    if (fields.status === "projected") {
      patchData.$unset = { ...patchData.$unset, dateCompleted: 1 };
    }
  }

  if (fields.dateProjected) {
    patchData.$set = { ...patchData.$set, dateProjected: fields.dateProjected };
  }

  if (fields.dateCompleted) {
    patchData.$set = { ...patchData.$set, dateCompleted: fields.dateCompleted };
  }

  if (!Object.keys(patchData.$set!).length && !Object.keys(patchData.$unset!).length) {
    return certification;
  }

  const res = await Certification.updateOne({ _id: certification._id }, patchData, { session });

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to edit certification");
  }

  await updateLatestReportOnCertificationPatch(certification._id, patchData, session);

  return certification;
};
