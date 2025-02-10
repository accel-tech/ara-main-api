import { Router } from "express";
import { ReportCertificationsHandler } from "./handler";
import { parseBody } from "../../../config/middlewares/parseBody";

const router = Router();

router.post("/", parseBody, ReportCertificationsHandler.addCertification);
router.delete("/:certificationId", ReportCertificationsHandler.removeCertification);

export default router;
