import { ObjectId } from "mongodb";
import { User } from "../../../config/types/user";

export const getDepartmentMembers = async (id: string) => {
  const members = await User.find(
    {
      role: "basic",
      departmentAccess: {
        $elemMatch: { _id: new ObjectId(id), access: { $in: ["member", "lead"] } }
      }
    },
    { projection: { _id: 1, name: 1, email: 1 } }
  );
  return members;
};
