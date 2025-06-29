import { TaskAlt } from "@mui/icons-material";
import { styled } from "@mui/material";
import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Draggable } from "../../../components/Draggable";
import { EditableText } from "../../../components/EditableText";
import { SectionDivider } from "../../../components/SectionDivider";
import { useReorder } from "../../../hooks/useReorder";
import { getTaskDueDateText } from "../../../lib/getTaskDueDateText";
import { useTaskSorter } from "../../../lib/taskSorter";
import {
  useListsQuery,
  useUpdateListMutation,
} from "../../../store/slices/listSlice";
import { RootState } from "../../../store/store";
import { Task } from "../../../types/Task";
import { TaskCard } from "./TaskCard";
import { Droppable } from "../../../components/Droppable";

const ListNameText = styled(EditableText)({
  width: "fit-content",
});

export const ListFocusView = () => {
  const { selectedListId } = useSelector(
    (state: RootState) => state.focusView,
    shallowEqual,
  );
  const [updateListName] = useUpdateListMutation();
  const { data: lists, refetch: refetchLists } = useListsQuery();
  const onReorder = useReorder();
  const taskSorter = useTaskSorter("listViewOrder");

  const selectedList = lists?.find((list) => list.id === selectedListId);
  const handleListNameChange = (newListName: string) => {
    if (newListName && selectedListId) {
      updateListName({ id: selectedListId.toString(), listName: newListName });
    }
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
    (window as any)?.subscribe?.refreshTasks(() => refetchLists());
  }, [refetchLists]);

  let index = 0;

  return (
    <div>
      <ListNameText
        label="List Name"
        displayAs="h1"
        initialValue={selectedList?.listName}
        onSave={handleListNameChange}
        displayIcon={<TaskAlt sx={{ margin: "0 10px" }} />}
      />

      {Object.entries(tasksOrganizedByDate).map(([dateStr, tasks]) => (
        <>
          <SectionDivider>{dateStr}</SectionDivider>
          <Droppable id={dateStr}>
            {tasks.map((task) => (
              <Draggable key={task.id} id={String(task.id)}>
                <TaskCard key={task.id} task={task} index={index++} />
              </Draggable>
            ))}
          </Droppable>
        </>
      ))}
    </div>
  );
};
