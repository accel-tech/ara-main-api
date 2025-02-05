import { Router } from "express";
import { checkAuth } from "../../../config/middlewares/checkAuth";
import { requiresAuth } from "../../../config/middlewares/requiresAuth";
import { requiresRoles } from "../../../config/middlewares/requiresRoles";

import { parseQuery } from "../../../config/middlewares/parseQuery";
import { parseBody } from "../../../config/middlewares/parseBody";
import { requiresDepartmentAccess } from "../../departments/middlewares/requiresDepartmentAccess";
import { CertificationsHandler } from "../handlers";
import { usesTransaction } from "../../../config/utils/mongo";
import { requiresCertificationOwner } from "../middlewares/requiresCertificationOwner";

const router = Router();
router.use(checkAuth, requiresAuth);

// router.get("/");
// router.get("/:id");

router.post("/", parseBody, usesTransaction, CertificationsHandler.addCertification);
router.patch(
  "/:id",
  requiresRoles("basic"),
  requiresCertificationOwner,
  usesTransaction,
  parseBody,
  CertificationsHandler.editCertification
);
router.delete(
  "/:id",
  requiresRoles("basic"),
  requiresCertificationOwner,
  usesTransaction,
  CertificationsHandler.deleteCertification
);

export default router;
