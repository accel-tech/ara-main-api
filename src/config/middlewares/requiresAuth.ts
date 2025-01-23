import PermissionError from "../errors/PermissionError";
import { xRequestHandler } from "../types/request";

export const requiresAuth: xRequestHandler = (req, res, next) => {
  if (req.user) return next();
  throw new PermissionError("You are not authorized to access this resource.", 403);
};
