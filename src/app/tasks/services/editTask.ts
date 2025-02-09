import { reqUser } from "../../../config/types/request";
import { UpdateFilter } from "mongodb";
import { validateEditTask } from "../validation/edit";
import { ITask, Task } from "../../../config/types/task";

export const editTask = async (task: ITask, data: unknown) => {
  const fields = await validateEditTask(data);

  const patchData: UpdateFilter<ITask> = { $set: {}, $unset: {} };

  if (fields.text && fields.text !== task.text) {
    patchData.$set = { ...patchData.$set, text: fields.text };
  }

  if (!Object.keys(patchData.$set!).length && !Object.keys(patchData.$unset!).length) {
    return task;
  }

  const res = await Task.updateOne({ _id: task._id }, patchData);

  if (res.matchedCount !== 1 || res.modifiedCount !== res.matchedCount) {
    throw new Error("Failed to edit task");
  }

  return task;
};
