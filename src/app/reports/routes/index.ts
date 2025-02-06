import { Router } from "express";
import { checkAuth } from "../../../config/middlewares/checkAuth";
import { requiresAuth } from "../../../config/middlewares/requiresAuth";
import { requiresRoles } from "../../../config/middlewares/requiresRoles";
import { ReportHandlers } from "../handlers";
import { parseQuery } from "../../../config/middlewares/parseQuery";
import { parseBody } from "../../../config/middlewares/parseBody";
import { requiresReportAccess } from "../middleware/requiresReportAccess";

import reportNoteRouter from "../_notes/router";
import reportMetricsRouter from "../_metrics/router";
import reportCertificationsRouter from "../_certifications/router";
import reportProjectsRouter from "../_projects/router";

const router = Router();
router.use(checkAuth, requiresAuth);

router.get("/", requiresRoles("admin"), ReportHandlers.getReports);
router.get("/find", parseQuery, ReportHandlers.findReport);
router.get("/:id", requiresRoles("admin"), ReportHandlers.getReport);
router.post("/", parseBody, ReportHandlers.createReport);

//
router.use("/:id/notes", requiresReportAccess("member", "lead"), reportNoteRouter);
router.use("/:id/metrics", requiresReportAccess("lead"), reportMetricsRouter);
router.use("/:id/projects", requiresReportAccess("lead", "member"), reportProjectsRouter);
// router.use(
//   "/:id/certifications",
//   requiresReportAccess("member", "lead"),
//   reportCertificationsRouter
// );

export default router;
