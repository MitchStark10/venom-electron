import { styled } from "@mui/material";
import moment from "moment";
import React, { FC, useRef } from "react";
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
}

const TaskCardContainer = styled("div")(({ theme }) => ({
  margin: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
  border: "1px solid transparent",
  borderRadius: theme.spacing(1),
  "&:hover": {
    border: `1px solid ${theme.palette.divider}`,
  },
  cursor: "pointer",
}));

export const TaskCard: FC<Props> = ({ task, showListName, index }) => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [updateTask] = useUpdateTaskMutation();
  const dispatch = useDispatch();
  const tags = task.taskTag?.map((taskTag) => taskTag.tag) || [];

  const onTaskNameChange = (newTaskName: string) => {
    if (newTaskName !== task.taskName) {
      updateTask({ ...task, taskName: newTaskName });
    }
  };

  const onCheckTask = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIsCompletedValue = !task.isCompleted;
    // TODO: Delete the task if the user is not set up with a paid account
    await updateTask({
      ...task,
      isCompleted: newIsCompletedValue,
      dateCompleted: newIsCompletedValue
        ? moment().startOf("day").toISOString()
        : null,
    });
    // deleteTask({ id: task.id.toString() });
  };

  return (
    <TaskCardContainer
      ref={cardContainerRef}
      onClick={() => {
        dispatch(setSelectedTask(task));
        dispatch(setModalView("task"));
        dispatch(setIsModalOpen(true));
      }}
      tabIndex={index}
    >
      <CheckboxWithEditableLabel
        displayAs="p"
        inputLabel="Task"
        initialValue={task.taskName}
        onInputChange={onTaskNameChange}
        onCheckboxClick={onCheckTask}
        isChecked={task.isCompleted}
        listName={showListName ? task.list?.listName : undefined}
        tags={tags}
        preventEdits
      />
    </TaskCardContainer>
  );
};
