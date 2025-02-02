import { ObjectId } from "mongodb";
import { User } from "../../../config/types/user";
import ClientError from "../../../config/errors/ClientError";

export const validateEmployeeId = async (id: string) => {
  const user = await User.findOne(
    { _id: new ObjectId(id) },
    { projection: { _id: 1, name: 1, email: 1 } }
  );
  if (user) return { _id: user._id, name: user.name, email: user.email };

  throw new ClientError(`Could not find user '${id}'`);
};
