import { Router } from "express";
import { parseBody } from "../../../config/middlewares/parseBody";
import { ReportCertificationsHandler } from "./handler";

const router = Router();

// router.post("/", parseBody, ReportCertificationsHandler.addCertification);

export default router;
