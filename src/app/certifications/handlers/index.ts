import { handler } from "../../../config/types/request";
import { ensureValue } from "../../../config/utils/misc";
import { httpHandler } from "../../../config/http/httpHandler";
import assert from "assert";
import { addCertification } from "../services/addCertification";
import { editCertification } from "../services/editCertification";
import { deleteCertification } from "../services/deleteCertification";
import { getCertifications } from "../services/getCertifications";

export class CertificationsHandler {
  @httpHandler("Get Certifications")
  static getCertifications: handler = async (req) => {
    return await getCertifications(req.qFilter, req.qOptions, ensureValue(req.user));
  };

  @httpHandler("Add Certification", 201)
  static addCertification: handler = async (req) => {
    return await addCertification(
      ensureValue(req.body),
      ensureValue(req.user),
      ensureValue(req.session)
    );
  };

  @httpHandler("Edit Certification", 202)
  static editCertification: handler = async (req) => {
    assert(req.document?.kind === "certification");
    return await editCertification(
      ensureValue(req.document.object),
      ensureValue(req.body),
      ensureValue(req.user),
      ensureValue(req.session)
    );
  };

  @httpHandler("Delete Certification", 202)
  static deleteCertification: handler = async (req) => {
    assert(req.document?.kind === "certification");
    return await deleteCertification(ensureValue(req.document.object), ensureValue(req.session));
  };
}
