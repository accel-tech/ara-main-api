import { handler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";
import { httpHandler } from "../../../config/http/httpHandler";
import assert from "assert";
import { addCertification, removeCertification } from "./services";

export class ReportCertificationsHandler {
  @httpHandler("Add Report Certification")
  static addCertification: handler = async (req) => {
    assert(req.document?.kind === "report");
    return await addCertification(
      ensureValue(req.document.object),
      ensureValue(req.body),
      ensureValue(req.user)
    );
  };

  @httpHandler("Remove Report Certification")
  static removeCertification: handler = async (req) => {
    assert(req.document?.kind === "report");
    return await removeCertification(
      ensureValue(req.params.certificationId),
      ensureValue(req.document.object),
      ensureValue(req.user)
    );
  };
}
