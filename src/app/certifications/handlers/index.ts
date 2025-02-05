import { handler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";
import { httpHandler } from "../../../config/http/httpHandler";
import assert from "assert";
import { addCertification } from "../services/addCertification";
import { editCertification } from "../services/editCertification";
import { deleteCertification } from "../services/deleteCertification";

export class CertificationsHandler {
  @httpHandler("Add Certification")
  static addCertification: handler = async (req) => {
    return await addCertification(
      ensureValue(req.body),
      ensureValue(req.user),
      ensureValue(req.session)
    );
  };

  @httpHandler("Edit Certification")
  static editCertification: handler = async (req) => {
    assert(req.document?.kind === "certification");
    return await editCertification(
      ensureValue(req.document.object),
      ensureValue(req.body),
      ensureValue(req.user),
      ensureValue(req.session)
    );
  };

  @httpHandler("Delete Certification")
  static deleteCertification: handler = async (req) => {
    assert(req.document?.kind === "certification");
    return await deleteCertification(ensureValue(req.document.object), ensureValue(req.session));
  };
}
