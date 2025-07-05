import { useSelector } from "react-redux";
import {
  UpdateReorderTask,
  useReorderTaskMutation,
} from "../store/slices/taskSlice";
import { Task } from "../types/Task";
import { RootState } from "../store/store";

export const useReorder = () => {
  const [reorderTask] = useReorderTaskMutation();
  const { focusView } = useSelector((state: RootState) => state.focusView);

  const onReorder = (
    prevPos: number,
    newPos: number,
    tasks: Task[],
    updatedTask: Task,
  ) => {
    const tasksCopy = [...tasks];

    if (prevPos !== null) {
      tasksCopy.splice(prevPos, 1);
    }

    tasksCopy.splice(newPos, 0, updatedTask);

    const reorderedTasksRequestBody: UpdateReorderTask[] = tasksCopy.map(
      (task, index) => {
        return {
          id: task.id,
          newOrder: index,
          taskName: task.taskName,
          newDueDate: task.dueDate,
          fieldToUpdate:
            focusView === "list" || focusView === "today"
              ? "listViewOrder"
              : "combinedViewOrder",
        };
      },
    );

    reorderTask({ tasksToUpdate: reorderedTasksRequestBody });
  };

  return onReorder;
};
