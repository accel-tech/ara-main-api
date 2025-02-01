import { Router } from "express";
import { checkAuth } from "../../../config/middlewares/checkAuth";
import { requiresAuth } from "../../../config/middlewares/requiresAuth";
import { requiresRoles } from "../../../config/middlewares/requiresRoles";
import { ReportHandlers } from "../handlers";
import { parseQuery } from "../../../config/middlewares/parseQuery";
import { parseBody } from "../../../config/middlewares/parseBody";
import { requiresReportAccess } from "../middleware/requiresReportAccess";
import reportNoteRouter from "../_notes/router";

const router = Router();
router.use(checkAuth, requiresAuth);

router.get("/", requiresRoles("admin"), ReportHandlers.getReports);
router.get("/find", parseQuery, ReportHandlers.findReport);
router.get("/:id", requiresRoles("admin"), ReportHandlers.getReport);
router.post("/", parseBody, ReportHandlers.createReport);

//
router.use("/:id/notes", requiresReportAccess("member", "lead"), reportNoteRouter);

export default router;
