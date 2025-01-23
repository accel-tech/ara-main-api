import fetch from "isomorphic-fetch";
import PermissionError from "../errors/PermissionError";
import { xRequestHandler } from "../types/request";
import { createKeycloakUser, getKeycloakReqUser } from "../utils/user";

export const checkAuth: xRequestHandler = async (req, res, next) => {
  const accessToken = req.headers["authorization"]?.split(" ")?.[1];
  if (!accessToken) return next();

  try {
    const response = await fetch(
      `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`.replace(
        "//",
        "/"
      ),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const data = (await response.json()) as any;
    if (data.error) throw new Error(data.error_description);
    if (!data.sub) throw new Error("No sub in response");

    // check user associated with keycloak Id
    let user = await getKeycloakReqUser(data.sub);

    // first access to application => create associated user
    if (!user) user = await createKeycloakUser(data);

    req.user = user;
  } catch (err) {
    console.log(err);
    throw new PermissionError("You are not authorized to access this resource.");
  }
  return next();
};
