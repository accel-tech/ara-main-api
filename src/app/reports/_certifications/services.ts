import { IReport, Report } from "../../../config/types/report";
import { validateAddCertification } from "./validation";
import ClientError from "../../../config/errors/ClientError";
import { reqUser } from "../../../config/types/request";
import assert from "assert";
import { ObjectId } from "mongodb";
import { RDCertification } from "../../../config/types/rd-certification";
import { validateEmployeeId } from "./utils";

export const addCertification = async (report: IReport, data: unknown, user: reqUser) => {
  if (report.status !== "draft") {
    throw new ClientError(`Can no longer edit report that is '${report.status}'`);
  }

  assert(user.role === "basic");

  const isLead = user.departmentAccess.some(
    (dep) => dep._id.toString() === report.department._id.toString() && dep.access === "lead"
  );
  const fields = await validateAddCertification(data, isLead);

  const nData = {
    _id: new ObjectId(),
    title: fields.title,
    examCode: fields.examCode,
    examLink: fields.examLink,
    employee: isLead
      ? await validateEmployeeId(fields.employee!._id)
      : { _id: user._id, name: user.name, email: user.email },
    dateAdded: new Date()
  };

  const certification: RDCertification =
    fields.status === "completed"
      ? {
          ...nData,
          status: "completed",
          dateCompleted: new Date(fields.dateCompleted!)
        }
      : { ...nData, status: "projected", dateProjected: new Date(fields.dateProjected!) };

  const res = await Report.updateOne(
    { _id: report._id },
    { $push: { certifications: certification } }
  );

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to add certification");
  }

  return certification;
};
