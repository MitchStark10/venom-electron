import { TaskAlt } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Draggable } from "react-drag-reorder";
import { shallowEqual, useSelector } from "react-redux";
import { Button } from "../../../components/Button";
import { EditableText } from "../../../components/EditableText";
import { SectionDivider } from "../../../components/SectionDivider";
import { getTaskDueDateText } from "../../../lib/getTaskDueDateText";
import { taskSorter } from "../../../lib/taskSorter";
import {
  useListsQuery,
  useUpdateListMutation,
} from "../../../store/slices/listSlice";
import {
  UpdateReorderTask,
  useReorderTaskMutation,
} from "../../../store/slices/taskSlice";
import { RootState } from "../../../store/store";
import { Task } from "../../../types/Task";
import { NewTaskForm } from "./NewTaskForm";
import { TaskCard } from "./TaskCard";

export const ListFocusView = () => {
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const { selectedListId } = useSelector(
    (state: RootState) => state.focusView,
    shallowEqual
  );
  const [updateListName] = useUpdateListMutation();
  const [reorderTask] = useReorderTaskMutation();
  const { data: lists, refetch: refetchLists } = useListsQuery();

  const selectedList = lists?.find((list) => list.id === selectedListId);
  const handleListNameChange = (newListName: string) => {
    if (newListName && selectedListId) {
      updateListName({ id: selectedListId.toString(), listName: newListName });
    }
  };

  const onReorder = (prevPos: number, newPos: number, tasks: Task[]) => {
    const posDiff = newPos - prevPos;
    const tasksCopy = [...tasks];
    const [removed] = tasksCopy.splice(prevPos, 1);

    const allTasksCopy = [...selectedList!.tasks].sort(taskSorter);
    const indexOfTaskToReorder = allTasksCopy.findIndex(
      (task) => task.id === removed.id
    );
    allTasksCopy.splice(indexOfTaskToReorder, 1);
    allTasksCopy.splice(indexOfTaskToReorder + posDiff, 0, removed);

    const reorderedTasksRequestBody: UpdateReorderTask[] = allTasksCopy.map(
      (task, index) => ({
        fieldToUpdate: "listViewOrder",
        id: task.id,
        newOrder: index,
        taskName: task.taskName,
      })
    );
    reorderTask({ tasksToUpdate: reorderedTasksRequestBody });
  };

  const tasksOrganizedByDate =
    (selectedList?.tasks ? [...selectedList.tasks] : [])
      .sort(taskSorter)
      .reduce<Record<string, Task[]>>((acc, task) => {
        const taskDueDate = getTaskDueDateText(task.dueDate);

        if (!acc[taskDueDate]) {
          acc[taskDueDate] = [];
        }

        acc[taskDueDate].push(task);

        return acc;
      }, {}) || {};

  useEffect(() => {
    (window as any)?.subscribe.refreshTasks(() => refetchLists());
  }, [refetchLists]);

  return (
    <div>
      <EditableText
        label="List Name"
        displayAs="h1"
        initialValue={selectedList?.listName}
        onSave={handleListNameChange}
        displayIcon={<TaskAlt sx={{ margin: "0 10px" }} />}
      />

      {Object.entries(tasksOrganizedByDate).map(([dateStr, tasks]) => (
        <div>
          <SectionDivider>{dateStr}</SectionDivider>
          {tasks.length > 0 && (
            <Draggable
              key={tasks.map((task) => JSON.stringify(task)).join("")}
              onPosChange={(prevOrder, newOrder) =>
                onReorder(prevOrder, newOrder, tasks)
              }
            >
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </Draggable>
          )}
        </div>
      ))}

      {showAddTaskForm ? (
        <NewTaskForm
          onAddNewTask={() => setShowAddTaskForm(false)}
          listId={selectedListId}
        />
      ) : (
        <Button variant="contained" onClick={() => setShowAddTaskForm(true)}>
          Add Task
        </Button>
      )}
    </div>
  );
};
