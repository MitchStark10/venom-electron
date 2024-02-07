import { SxProps, styled, useTheme } from "@mui/material";
import moment from "moment";
import { FC, useRef, useState } from "react";
import { CheckboxWithEditableLabel } from "../../../components/CheckboxWithEditableLabel";
import { DatePicker } from "../../../components/DatePicker";
import { useClickOutside } from "../../../hooks/useClickOutside";
import {
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "../../../store/slices/taskSlice";
import { Task } from "../../../types/Task";

interface Props {
  task: Task;
}

const TaskCardContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  "&:focus": {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
  },
}));

const DueDatePicker = styled(DatePicker)(({ theme }) => ({
  marginLeft: theme.spacing(22),
  marginTop: theme.spacing(4),
}));

export const TaskCard: FC<Props> = ({ task }) => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();

  const clickAwayHandler = () => setIsEditing(false);

  const stEditingContainer: SxProps = {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    boxShadow: `0 0 3px ${theme.palette.grey[800]}`,
    padding: `${theme.spacing(10)} ${theme.spacing(5)}`,
  };

  const onTaskNameChange = (newTaskName: string) => {
    updateTask({ id: task.id, taskName: newTaskName });
  };

  const onDueDateChange = (newDueDate: any) => {
    const newDueDateMoment = newDueDate ? moment(newDueDate) : null;
    updateTask({
      id: task.id,
      taskName: task.taskName,
      dueDate: newDueDateMoment?.toISOString() || null,
    });
  };

  const onCheckTask = () => {
    deleteTask({ id: task.id.toString() });
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
    >
      <CheckboxWithEditableLabel
        displayAs="h4"
        inputLabel="Task"
        initialValue={task.taskName}
        onInputChange={onTaskNameChange}
        onCheckboxClick={onCheckTask}
        isEditing={isEditing}
        // Prevent set of isEditing via blur. Use click outside or
        // escape key instead.
        onEditingStateChange={isEditing ? undefined : setIsEditing}
      />
      {isEditing && (
        <DueDatePicker
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
      )}
    </TaskCardContainer>
  );
};
