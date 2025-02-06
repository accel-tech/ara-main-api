import { Router } from "express";
import { checkAuth } from "../../../config/middlewares/checkAuth";
import { requiresAuth } from "../../../config/middlewares/requiresAuth";
import { requiresRoles } from "../../../config/middlewares/requiresRoles";
import { parseBody } from "../../../config/middlewares/parseBody";
import { ProjectsHandler } from "../handlers";
import { usesTransaction } from "../../../config/utils/mongo";
import { requiresProjectDepartmentLead } from "../middlewares/requiresProjectDepartmentLead";
import { parseQuery } from "../../../config/middlewares/parseQuery";

const router = Router();
router.use(checkAuth, requiresAuth);

router.get("/", requiresRoles("basic"), parseQuery, ProjectsHandler.getProjects);
router.post("/", requiresRoles("basic"), parseBody, usesTransaction, ProjectsHandler.addProject);
router.patch(
  "/:id",
  requiresRoles("basic"),
  requiresProjectDepartmentLead,
  usesTransaction,
  parseBody,
  ProjectsHandler.editProject
);

export default router;
