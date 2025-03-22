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

  const onReorder = (prevPos: number, newPos: number, tasks: Task[]) => {
    const tasksCopy = [...tasks];
    const [removed] = tasksCopy.splice(prevPos, 1);
    tasksCopy.splice(newPos, 0, removed);

    const reorderedTasksRequestBody: UpdateReorderTask[] = tasksCopy.map(
      (task, index) => {
        // If on the list view, swap out the order from whatever value exists at this index in the original array.
        // this logic preserves the order of the tasks across all views
        const newOrder =
          focusView === "list" && tasks[index].listViewOrder
            ? tasks[index].listViewOrder
            : index;

        return {
          id: task.id,
          newOrder,
          taskName: task.taskName,
          newDueDate: task.dueDate,
        };
      }
    );

    reorderTask({ tasksToUpdate: reorderedTasksRequestBody });
  };

  return onReorder;
};
