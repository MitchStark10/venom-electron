import { useDispatch, useSelector } from "react-redux";
import {
  UpdateReorderTask,
  useReorderTaskMutation,
} from "../store/slices/taskSlice";
import { Task } from "../types/Task";
import { AppDispatch, RootState } from "../store/store";
import { listsApi } from "../store/slices/listSlice";

export const useReorder = () => {
  const [reorderTask] = useReorderTaskMutation();
  const { focusView } = useSelector((state: RootState) => state.focusView);
  const dispatch = useDispatch<AppDispatch>();

  const onReorder = (
    prevPos: number,
    newPos: number,
    tasks: Task[],
    updatedTask: Task,
  ) => {
    console.log("updating task details:", {
      taskName: updatedTask.taskName,
      prevPos,
      newPos,
    });

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

    try {
      dispatch(
        listsApi.util.updateQueryData("lists", undefined, (draft) => {
          return draft.forEach((list) => {
            if (list.id !== updatedTask.listId) return;

            list.tasks?.forEach((task, index) => {
              const updatedTaskData = reorderedTasksRequestBody.find(
                (t) => t.id === task.id,
              );
              if (updatedTaskData) {
                task.listViewOrder = updatedTaskData.newOrder;
                task.dueDate = updatedTaskData.newDueDate;
              }
              task.combinedViewOrder = index;
            });
          });
        }),
      );
    } catch (error) {
      console.error(
        "Error creating reordered tasks request body:",
        JSON.stringify(error),
      );
    }

    reorderTask({ tasksToUpdate: reorderedTasksRequestBody });
  };

  return onReorder;
};
