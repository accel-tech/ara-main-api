import { KeycloakResponse } from "../types/keycloak";
import { reqUser } from "../types/request";
import { IUser, User } from "../types/user";
import assert from "assert";

export const getKeycloakReqUser = async (sub: string): Promise<reqUser | undefined> => {
  // get cached
  const user = await User.findOne({ keycloakId: sub });

  if (user?.role === "basic") {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      departmentAccess: user.departmentAccess
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

    assert(user.role === "admin");

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  // create regular user
  else {
    const createData: Omit<IUser & { role: "basic" }, "_id" | "__v"> = {
      ...genericData,
      role: "basic",
      departmentAccess: []
    };
    const user = await User.create(createData);

    assert(user.role === "basic");

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      // @ts-ignore
      departmentAccess: user.departmentAccess
    };
  }
};
