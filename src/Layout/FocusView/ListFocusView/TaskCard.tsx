import { useDndContext } from "@dnd-kit/core";
import { styled, useTheme } from "@mui/material";
import moment from "moment";
import React, { CSSProperties, FC, useRef } from "react";
import { useDispatch } from "react-redux";
import { CheckboxWithEditableLabel } from "../../../components/CheckboxWithEditableLabel";
import { setSelectedTask } from "../../../store/slices/focusViewSlice";
import { setIsModalOpen, setModalView } from "../../../store/slices/modalSlice";
import { useUpdateTaskMutation } from "../../../store/slices/taskSlice";
import { Task } from "../../../types/Task";

interface Props {
  task: Task;
  showListName?: boolean;
  index: number;
  containerId?: string;
}

const TaskCardContainer = styled("div", {
  shouldForwardProp: (propName) => propName !== "isDragging",
})<{ isDragging: boolean }>(({ theme, isDragging }) => ({
  border: "1px solid transparent",
  borderRadius: theme.spacing(1),
  "&:hover": {
    border: isDragging ? undefined : `1px solid ${theme.palette.divider}`,
  },
  cursor: "pointer",
}));

export const TaskCard: FC<Props> = ({
  task,
  showListName,
  index,
  containerId,
}) => {
  const theme = useTheme();
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [updateTask] = useUpdateTaskMutation();
  const dispatch = useDispatch();
  const tags = task.taskTag?.map((taskTag) => taskTag.tag) || [];
  const [isCheckedOverride, setIsCheckedOverride] = React.useState<boolean>(
    Boolean(task.isCompleted)
  );
  const { over, active } = useDndContext();

  const isOver = over?.id && parseInt(over.id as string) === task.id;
  const isDraggingDown =
    isOver &&
    active?.rect.current?.initial?.top &&
    over &&
    active.rect.current?.initial?.top > over.rect.top;

  const shouldShowInitialDragBorder =
    (over && (over.id as string) === containerId && index === 0) ||
    isDraggingDown;

  const dragBeforeStyle: CSSProperties = {
    borderTop: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 0,
  };

  const dragAfterStyle: CSSProperties = {
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 0,
  };

  const onTaskNameChange = (newTaskName: string) => {
    if (newTaskName !== task.taskName) {
      updateTask({ ...task, taskName: newTaskName });
    }
  };

  const onCheckTask = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    const newIsCompletedValue = !task.isCompleted;
    setIsCheckedOverride(newIsCompletedValue);
    await updateTask({
      ...task,
      isCompleted: newIsCompletedValue,
      dateCompleted: newIsCompletedValue
        ? moment().startOf("day").toISOString()
        : null,
    });
  };

  const onOpenTask = () => {
    dispatch(setSelectedTask(task));
    dispatch(setModalView("task"));
    dispatch(setIsModalOpen(true));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      onOpenTask();
    } else if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      e.stopPropagation();
      onCheckTask();
    }
  };

  return (
    <TaskCardContainer
      ref={cardContainerRef}
      isDragging={Boolean(isOver)}
      onClick={onOpenTask}
      tabIndex={index}
      onKeyDown={onKeyDown}
      sx={
        shouldShowInitialDragBorder
          ? dragBeforeStyle
          : isOver
          ? dragAfterStyle
          : {}
      }
    >
      <CheckboxWithEditableLabel
        displayAs="p"
        inputLabel="Task"
        initialValue={task.taskName}
        onInputChange={onTaskNameChange}
        onCheckboxClick={onCheckTask}
        isChecked={isCheckedOverride}
        listName={showListName ? task.list?.listName : undefined}
        tags={tags}
        preventEdits
        isRecurring={Boolean(task.recurringSchedule)}
      />
    </TaskCardContainer>
  );
};
