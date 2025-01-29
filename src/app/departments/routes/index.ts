import { Router } from "express";
import { checkAuth } from "../../../config/middlewares/checkAuth";
import { requiresAuth } from "../../../config/middlewares/requiresAuth";
import { DepartmentHandlers } from "../handlers";
import { parseBody } from "../../../config/middlewares/parseBody";
import { usesTransaction } from "../../../config/utils/mongo";
import { requiresRoles } from "../../../config/middlewares/requiresRoles";

const router = Router();
router.use(checkAuth, requiresAuth, requiresRoles("admin"));

router.get("/", DepartmentHandlers.getDepartments);
router.post("/", parseBody, DepartmentHandlers.createDepartment);
router.get("/:id", DepartmentHandlers.getDepartment);
router.patch("/:id", parseBody, DepartmentHandlers.editDepartment);

export default router;
