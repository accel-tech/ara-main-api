import { ObjectId } from "mongodb";
import ClientError from "../../../config/errors/ClientError";
import { IReport, Report } from "../../../config/types/report";
import { reqUser } from "../../../config/types/request";
import PermissionError from "../../../config/errors/PermissionError";
import assert from "assert";
import { validateAddCertification } from "./validation";
import { Certification } from "../../../config/types/certification";

export const addCertification = async (report: IReport, data: unknown, user: reqUser) => {
  if (report.status !== "draft") {
    throw new ClientError(`Can no longer edit report that is '${report.status}'`);
  }

  const fields = await validateAddCertification(data);

  if (report.certifications.some((cert) => cert._id.toString() === fields.certificationId)) {
    throw new ClientError(`Certification already included in Report`);
  }

  const certification = await Certification.findOne({
    _id: new ObjectId(fields.certificationId),
    "department._id": report.department._id
  });

  if (!certification) throw new ClientError(`Could not find project in this department`);
  assert(user.role === "basic");

  const isLead = user.departmentAccess.some(
    (dep) => dep._id.toString() === report.department._id.toString() && dep.access === "lead"
  );

  if (certification.employee._id.toString() !== user._id.toString() && !isLead) {
    throw new PermissionError("You can only add your own certifications");
  }

  const rdcertification = { ...certification, department: undefined, __v: undefined };

  const res = await Report.updateOne(
    { _id: report._id },
    { $push: { certifications: rdcertification } }
  );

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to add certification to report");
  }

  return rdcertification;
};

export const removeCertification = async (
  certificationId: string,
  report: IReport,
  user: reqUser
) => {
  if (report.status !== "draft") {
    throw new ClientError(`Can no longer edit report that is '${report.status}'`);
  }

  const certification = report.certifications.find(
    (cert) => cert._id.toString() === certificationId
  );

  if (!certification) throw new ClientError(`Certification '${certificationId}' not found`);

  assert(user.role === "basic");

  const isLead = user.departmentAccess.some(
    (dep) => dep._id.toString() === report.department._id.toString() && dep.access === "lead"
  );

  if (certification.employee._id.toString() !== user._id.toString() && !isLead) {
    throw new PermissionError("You cannot remove this certification");
  }

  const res = await Report.updateOne(
    { _id: report._id },
    {
      $pull: { certifications: { _id: new ObjectId(certificationId) } }
    }
  );

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to remove certification from report");
  }

  return {
    _id: certificationId
  };
};
