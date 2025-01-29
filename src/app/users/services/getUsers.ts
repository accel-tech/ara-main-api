import { Filter, FindOptions } from "mongodb";
import { IUser, User } from "../../../config/types/user";

export const getUsers = async (filter: Filter<IUser> = {}, options: FindOptions = {}) => {
  const users = await User.find(filter, options);

  return users;
};
