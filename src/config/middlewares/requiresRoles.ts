import PermissionError from "../errors/PermissionError";
import { reqUser, xRequestHandler } from "../types/request";
import { IUser } from "../types/user";
import { ensureValue } from "../utils/misc";

export const requiresRoles = (...roles: Array<IUser["role"]>) => {
  const handler: xRequestHandler = (req, res, next) => {
    const user = ensureValue<reqUser>(req.user);
    if (roles.includes(user.role)) return next();
    throw new PermissionError("Resource access unauthorized");
  };

  return handler;
};
