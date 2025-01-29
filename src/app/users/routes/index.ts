import { Router } from "express";
import { checkAuth } from "../../../config/middlewares/checkAuth";
import { requiresAuth } from "../../../config/middlewares/requiresAuth";
import { UserHandlers } from "../handlers";
import { parseBody } from "../../../config/middlewares/parseBody";
import { requiresRoles } from "../../../config/middlewares/requiresRoles";

const router = Router();
router.use(checkAuth, requiresAuth, requiresRoles("admin"));

router.get("/", UserHandlers.getUsers);
router.get("/:id", UserHandlers.getUser);
router.patch("/:id", parseBody, UserHandlers.editUser);

export default router;
