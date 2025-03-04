import { Router } from "express";
import { checkAuth } from "../../../config/middlewares/checkAuth";
import { requiresAuth } from "../../../config/middlewares/requiresAuth";
import { requiresRoles } from "../../../config/middlewares/requiresRoles";
import { parseQuery } from "../../../config/middlewares/parseQuery";
import { parseBody } from "../../../config/middlewares/parseBody";
import { MetricHandler } from "../handlers";
import { requiresCanEditMetric } from "../middlewares/requiresCanEditMetric";

const router = Router();
router.use(checkAuth, requiresAuth, requiresRoles("basic"));

router.get("/", parseQuery, MetricHandler.getMetrics);
router.get("/:id", MetricHandler.getMetric);
router.patch("/:id", requiresCanEditMetric, parseBody, MetricHandler.editMetric);

export default router;
