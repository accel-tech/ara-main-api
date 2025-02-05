import { ClientSession } from "mongoose";
import { Certification, ICertification } from "../../../config/types/certification";
import { removeCertificationFromLatestReport } from "../utils";

export const deleteCertification = async (
  certification: ICertification,
  session: ClientSession
) => {
  const res = await Certification.deleteOne({ _id: certification._id }, { session });

  if (!res.acknowledged || res.deletedCount !== 1) {
    throw new Error("Failed to delete certification");
  }

  await removeCertificationFromLatestReport(certification._id, session);

  return { _id: certification._id };
};
