import { Router } from "express";
import { checkAuth } from "../../../config/middlewares/checkAuth";
import { requiresAuth } from "../../../config/middlewares/requiresAuth";
import { AuthHandlers } from "../handlers";

// auth
const router = Router();

router.use(checkAuth);
router.use(requiresAuth);

router.get("/state", AuthHandlers.getAuth);

export default router;
