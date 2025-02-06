import { Router } from "express";
import { parseBody } from "../../../config/middlewares/parseBody";
import { ReportProjectsHandler } from "./handler";
import { requiresReportAccess } from "../middleware/requiresReportAccess";

const router = Router();

router.post("/", requiresReportAccess("lead"), parseBody, ReportProjectsHandler.addProject);

export default router;
