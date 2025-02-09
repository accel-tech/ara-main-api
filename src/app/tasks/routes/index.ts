import { Router } from "express";
import { checkAuth } from "../../../config/middlewares/checkAuth";
import { requiresAuth } from "../../../config/middlewares/requiresAuth";
import { requiresRoles } from "../../../config/middlewares/requiresRoles";
import { parseBody } from "../../../config/middlewares/parseBody";
import { TasksHandler } from "../handlers";
import { requiresTaskAccess } from "../middlewares/requiresTaskAccess";

const router = Router();
router.use(checkAuth, requiresAuth, requiresRoles("basic"));

router.post("/", parseBody, TasksHandler.addTask);
router.patch("/:id", requiresTaskAccess, parseBody, TasksHandler.editTask);
router.delete("/:id", requiresTaskAccess, TasksHandler.deleteTask);

export default router;
