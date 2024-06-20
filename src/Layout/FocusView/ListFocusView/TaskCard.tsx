import { SxProps, styled, useTheme } from "@mui/material";
import moment from "moment";
import React, { FC, useRef, useState } from "react";
import { CheckboxWithEditableLabel } from "../../../components/CheckboxWithEditableLabel";
import { DatePicker } from "../../../components/DatePicker";
import { TagDropdown } from "../../../components/TagDropdown";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { useUpdateTaskMutation } from "../../../store/slices/taskSlice";
import { Tag } from "../../../types/Tag";
import { Task } from "../../../types/Task";

interface Props {
  task: Task;
  showListName?: boolean;
}

const TaskCardContainer = styled("div")(({ theme }) => ({
  margin: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
  border: "1px solid transparent",
  borderRadius: theme.spacing(1),
  "&:focus, &:hover": {
    border: `1px solid ${theme.palette.divider}`,
  },
  cursor: "pointer",
}));

const RowContainer = styled("div")(({ theme }) => ({
  marginLeft: theme.spacing(6),
  marginTop: theme.spacing(2),
  display: "flex",
  gap: theme.spacing(3),
}));

export const TaskCard: FC<Props> = ({ task, showListName }) => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [updateTask] = useUpdateTaskMutation();
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();
  const [tags, setTags] = useState(task.tags || []);

  const clickAwayHandler = () => setIsEditing(false);

  const stEditingContainer: SxProps = {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    boxShadow: `0 0 3px ${theme.palette.grey[800]}`,
    padding: `${theme.spacing(2)} ${theme.spacing(1)}`,
  };

  const onTaskNameChange = (newTaskName: string) => {
    if (newTaskName !== task.taskName) {
      updateTask({ id: task.id, taskName: newTaskName });
    }
  };

  const onDueDateChange = (newDueDate: any) => {
    const newDueDateMoment = newDueDate ? moment(newDueDate) : null;
    updateTask({
      id: task.id,
      taskName: task.taskName,
      dueDate: newDueDateMoment?.toISOString() || null,
    });
  };

  const onTagChange = (newTags: Tag[]) => {
    setTags(newTags);
    updateTask({
      ...task,
      tagIds: newTags.map((tag) => tag.id),
    });
  };

  const onCheckTask = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Delete the task if the user is not set up with a paid account
    await updateTask({ ...task, isCompleted: !task.isCompleted });
    // deleteTask({ id: task.id.toString() });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsEditing(false);
    }
  };

  useClickOutside(cardContainerRef, clickAwayHandler);

  return (
    <TaskCardContainer
      sx={isEditing ? stEditingContainer : undefined}
      ref={cardContainerRef}
      onKeyDown={onKeyDown}
      onClick={() => {
        if (!isEditing) {
          setIsEditing(true);
        }
      }}
    >
      <CheckboxWithEditableLabel
        displayAs="p"
        inputLabel="Task"
        initialValue={task.taskName}
        onInputChange={onTaskNameChange}
        onCheckboxClick={onCheckTask}
        isEditing={isEditing}
        // Prevent set of isEditing via blur. Use click outside or
        // escape key instead.
        onEditingStateChange={isEditing ? undefined : setIsEditing}
        isChecked={task.isCompleted}
        listName={showListName ? task.list?.listName : undefined}
      />
      {isEditing && (
        <RowContainer>
          <DatePicker
            label="Due Date"
            slotProps={{
              popper: {
                disablePortal: true,
              },
            }}
            value={task.dueDate ? moment(task.dueDate) : null}
            onChange={onDueDateChange}
            clearable
          />
          <TagDropdown value={tags} onChange={onTagChange} />
        </RowContainer>
      )}
    </TaskCardContainer>
  );
};
