import { KeycloakResponse } from "../types/keycloak";
import { reqUser } from "../types/request";
import { User } from "../types/user";

export const getKeycloakReqUser = async (sub: string): Promise<reqUser | undefined> => {
  // get cached
  const user = await User.findOne({ keycloakId: sub });

  if (user?.role === "basic") {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  if (user?.role === "admin") {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  return undefined;
};

export const createKeycloakUser = async (
  keycloakData: KeycloakResponse
): Promise<reqUser | undefined> => {
  const genericData = {
    name: keycloakData.name,
    email: keycloakData.email,
    keycloakId: keycloakData.sub,
    isActive: true,
    dateCreated: new Date()
  };

  // create admin user
  if (!keycloakData.roles) {
    console.log(`Keycloak roles not provided`);
  }

  if (keycloakData.roles?.includes("ara-admin")) {
    const user = await User.create({
      ...genericData,
      role: "admin"
    });

    return {
      _id: user._id,
      name: keycloakData.name,
      email: keycloakData.email,
      role: "admin"
    };
  }

  // create regular user
  else {
    const user = await User.create({
      ...genericData,
      role: "basic"
    });

    return {
      _id: user._id,
      name: keycloakData.name,
      email: keycloakData.email,
      role: "basic"
    };
  }
};
