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
import { Button, CircularProgress } from "@mui/material";
import { FC, useState } from "react";
import { Draggable } from "../../../components/Draggable";
import { Droppable } from "../../../components/Droppable";
import { SectionDivider } from "../../../components/SectionDivider";
import { Title } from "../../../components/Title";
import { useDndSensors } from "../../../hooks/useDndSensors";
import { useReorder } from "../../../hooks/useReorder";
import { getTaskDueDateText } from "../../../lib/getTaskDueDateText";
import { useTaskSorter } from "../../../lib/taskSorter";
import { Task } from "../../../types/Task";
import { TaskCard } from "../ListFocusView/TaskCard";

type GroupByOptions = "date" | "list";

interface Props {
  title: string;
  tasks: Task[];
  isLoading: boolean;
  deleteAllTasks?: () => void;
  groupByOption?: GroupByOptions;
}

export const TimeBasedFocusView: FC<Props> = ({
  title,
  tasks,
  isLoading,
  deleteAllTasks,
  groupByOption = "list",
}) => {
  const sensors = useDndSensors();
  const onReorder = useReorder();
  const taskSorter = useTaskSorter(
    groupByOption === "list" ? "listViewOrder" : "combinedViewOrder"
  );

  const groupedTasks =
    groupByOption === "list"
      ? tasks?.reduce<Record<number, Task[]>>((acc, task) => {
          if (task.list) {
            if (acc[task.list.id]) {
              acc[task.list.id].push(task);
            } else {
              acc[task.list.id] = [task];
            }
          }
          return acc;
        }, {})
      : [...(tasks || [])]
          .sort(taskSorter)
          .reduce<Record<string, Task[]>>((acc, task) => {
            const taskDueDateText = getTaskDueDateText(task.dueDate);
            if (!acc[taskDueDateText]) {
              acc[taskDueDateText] = [];
            }
            acc[taskDueDateText].push(task);
            return acc;
          }, {});

  const [draggingTask, setDraggingTask] = useState<Task | null>(null);

  const onDragStart = (event: DragStartEvent) => {
    const activeTaskId = event.active.id;
    const draggingTask = tasks.find((task) => String(task.id) === activeTaskId);

    if (draggingTask) {
      setDraggingTask(draggingTask);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setDraggingTask(null);

    if (!event.active || !event.over) {
      console.warn("Drag end event missing active or over element");
      return;
    }

    const activeTaskId = event.active.id;
    const overId = event.over.id;

    const matchingOverTask = tasks.find((task) => String(task.id) === overId);

    // Over ID will just be the date string if dropped on a section divider
    const newDueDate = matchingOverTask
      ? matchingOverTask.dueDate
      : (overId as string);

    const activeTask = tasks.find((task) => String(task.id) === activeTaskId);

    if (!activeTask) {
      console.error("Task not found for drag end event");
      return;
    }

    const updatedTask = { ...activeTask, dueDate: newDueDate };

    const taskGroup =
      Object.entries(groupedTasks).find(([groupKey, group]) => {
        const groupIds = group.map((task) => String(task.id));
        return groupIds.includes(String(overId)) || groupKey === overId;
      })?.[1] || [];

    if (!taskGroup) {
      console.error("Task group not found for drag end event");
      return;
    }

    const prevPos =
      taskGroup.findIndex((task) => String(task.id) === activeTaskId) ?? null;
    const newPos =
      taskGroup.findIndex((task) => String(task.id) === overId) ?? 0;

    onReorder(prevPos, newPos, taskGroup, updatedTask);
  };

  let index = 0;

  return (
    <div>
      <Title>{title}</Title>
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        {Object.entries(groupedTasks || {}).map(([key, tasks]) => {
          console.log("key", key);
          return (
            <SortableContext
              key={`sortable-context-${key}`}
              items={tasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <Droppable id={key}>
                <SectionDivider>
                  {groupByOption === "list" ? tasks[0].list?.listName : key}
                </SectionDivider>
                {tasks.map((task) => (
                  <Draggable id={String(task.id)} key={`task-${task.id}`}>
                    <TaskCard
                      task={task}
                      showListName={groupByOption === "date"}
                      index={index++}
                    />
                  </Draggable>
                ))}
              </Droppable>
            </SortableContext>
          );
        })}
        {draggingTask && (
          <DragOverlay>
            <TaskCard task={draggingTask} index={0} />
          </DragOverlay>
        )}
      </DndContext>

      {deleteAllTasks && Object.entries(groupedTasks || {}).length > 0 && (
        <Button variant="contained" onClick={() => deleteAllTasks()}>
          Delete All Tasks
        </Button>
      )}
      {isLoading && <CircularProgress />}
      {!isLoading && Object.keys(groupedTasks || {}).length === 0 && (
        <p>No tasks found</p>
      )}
    </div>
  );
};
