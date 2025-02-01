import { Router } from "express";
import { parseBody } from "../../../config/middlewares/parseBody";
import { ReportMetricsHandler } from "./handler";

const router = Router();

router.patch("/", parseBody, ReportMetricsHandler.editMetrics);

export default router;
