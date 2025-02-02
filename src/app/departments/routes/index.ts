import { Router } from "express";
import { checkAuth } from "../../../config/middlewares/checkAuth";
import { requiresAuth } from "../../../config/middlewares/requiresAuth";
import { DepartmentHandlers } from "../handlers";
import { parseBody } from "../../../config/middlewares/parseBody";
import { usesTransaction } from "../../../config/utils/mongo";
import { requiresRoles } from "../../../config/middlewares/requiresRoles";
import { requiresDepartmentAccess } from "../middlewares/requiresDepartmentAccess";

const router = Router();
router.use(checkAuth, requiresAuth);

router.get("/", requiresRoles("admin"), DepartmentHandlers.getDepartments);
router.post("/", requiresRoles("admin"), parseBody, DepartmentHandlers.createDepartment);
router.get("/:id", requiresDepartmentAccess("lead"), DepartmentHandlers.getDepartment);
router.patch("/:id", requiresRoles("admin"), parseBody, DepartmentHandlers.editDepartment);

router.get(
  "/:id/members",
  requiresDepartmentAccess("lead"),
  DepartmentHandlers.getDepartmentMembers
);

export default router;
