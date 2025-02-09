import { ITask, Task } from "../../../config/types/task";

export const deleteTask = async (task: ITask) => {
  const res = await Task.deleteOne({ _id: task._id });

  if (!res.acknowledged || res.deletedCount !== 1) {
    throw new Error("Failed to delete task");
  }

  return { _id: task._id };
};
