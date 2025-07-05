import { TaskAlt } from "@mui/icons-material";
import { styled } from "@mui/material";
import { useEffect, useState } from "react";
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
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
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
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
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
    setDraggingTask(null);

    if (!event.active || !event.over) {
      console.warn("Drag end event missing active or over element");
      return;
    }

    const activeTaskId = event.active.id;
    const overId = event.over.id;

    const matchingTask = selectedList?.tasks.find(
      (task) => String(task.id) === overId,
    );

    // Over ID will just be the date string if dropped on a section divider
    const newDueDate = matchingTask ? matchingTask.dueDate : (overId as string);

    const tasks = Object.values(tasksOrganizedByDate).flat();
    const activeTask = selectedList?.tasks.find(
      (task) => String(task.id) === activeTaskId,
    );

    if (!activeTask) {
      console.error("Task not found for drag end event");
      return;
    }

    const updatedTask = { ...activeTask, dueDate: newDueDate };

    const prevPos = tasks.findIndex((task) => String(task.id) === activeTaskId);
    const newPos = tasks.findIndex((task) => String(task.id) === overId) ?? -1;

    console.log("Reorder event details", {
      prevPos,
      newPos: newPos + 1,
      activeTaskId,
      overId,
      updatedTask,
      newDueDate,
    });

    onReorder(prevPos, newPos + 1, tasks, updatedTask);
  };

  const onDragStart = (event: DragStartEvent) => {
    const activeTaskId = event.active.id;
    const taskList = Object.values(tasksOrganizedByDate).flat();
    const draggingTask = taskList.find(
      (task) => String(task.id) === activeTaskId,
    );

    if (draggingTask) {
      setDraggingTask(draggingTask);
    }
  };

  useEffect(() => {
    (window as any)?.subscribe?.refreshTasks(() => refetchLists());
  }, [refetchLists]);

  let index = 0;

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
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
      {draggingTask && (
        <DragOverlay>
          <TaskCard task={draggingTask} index={0} />
        </DragOverlay>
      )}
    </DndContext>
  );
};
