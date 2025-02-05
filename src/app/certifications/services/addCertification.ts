import { ClientSession } from "mongoose";
import { reqUser } from "../../../config/types/request";
import { validateAddCertification } from "../validation/add";
import assert from "assert";
import ClientError from "../../../config/errors/ClientError";
import { ObjectId } from "mongodb";
import { addCertificationToLatestReport, validateEmployeeId } from "../utils";
import { Certification, ICertification } from "../../../config/types/certification";
import PermissionError from "../../../config/errors/PermissionError";

export const addCertification = async (data: unknown, user: reqUser, session: ClientSession) => {
  const fields = await validateAddCertification(data);

  assert(user.role === "basic");

  const departmentAccess = user.departmentAccess.find(
    (dep) => dep._id.toString() === fields.departmentId
  );

  if (!departmentAccess || !["lead", "member"].includes(departmentAccess.access)) {
    throw new PermissionError("You do not have access to this deparment");
  }

  const isLead = departmentAccess.access === "lead";

  if (!isLead && fields.employeeId) {
    throw new ClientError(`Field 'employeeId' is not allowed`);
  }

  const certData: ICertification = {
    _id: new ObjectId(),
    title: fields.title,
    examCode: fields.examCode,
    examLink: fields.examLink,
    employee:
      isLead && fields.employeeId
        ? await validateEmployeeId(fields.employeeId)
        : { _id: user._id, name: user.name, email: user.email },
    dateAdded: new Date(),
    department: { _id: departmentAccess._id, title: departmentAccess.title },
    __v: 0,
    ...(fields.status === "completed"
      ? {
          status: "completed",
          dateCompleted: new Date(fields.dateCompleted!)
        }
      : { status: "projected", dateProjected: new Date(fields.dateProjected!) })
  };

  const certification = await Certification.create(certData, { session });

  await addCertificationToLatestReport(certData, session);

  return certification;
};
