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
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const NULL_DATE_SECTION_ID = "null-date";

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

  const onDragEnd = (event: DragEndEvent) => {
    if (!event.active || !event.over) {
      return;
    }

    const activeTaskId = event.active.id;
    const sectionId = event.over.id;

    const newDueDate = sectionId === NULL_DATE_SECTION_ID ? null : sectionId;
    const taskList = tasksOrganizedByDate[sectionId];

    if (!taskList) {
      return;
    }

    // TODO: Refactor this to support list changes
    // onReorder({
    //   activeId: activeTaskId,
    //   sectionId: sectionId,
    //   newDueDate,
    //   selectedListId,
    // });
  };

  useEffect(() => {
    (window as any)?.subscribe?.refreshTasks(() => refetchLists());
  }, [refetchLists]);

  let index = 0;

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div>
        <ListNameText
          label="List Name"
          displayAs="h1"
          initialValue={selectedList?.listName}
          onSave={handleListNameChange}
          displayIcon={<TaskAlt sx={{ margin: "0 10px" }} />}
        />

        {Object.entries(tasksOrganizedByDate).map(([dateStr, tasks]) => (
          <SortableContext
            key={dateStr}
            items={tasks.map((task) => String(task.id)) || []}
            strategy={verticalListSortingStrategy}
          >
            <Droppable id={tasks[0]?.dueDate || NULL_DATE_SECTION_ID}>
              <SectionDivider>{dateStr}</SectionDivider>
              {tasks.map((task) => (
                <Draggable key={task.id} id={String(task.id)}>
                  <TaskCard key={task.id} task={task} index={index++} />
                </Draggable>
              ))}
            </Droppable>
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
};
