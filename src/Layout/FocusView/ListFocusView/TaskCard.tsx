import { Checkbox, FormControlLabel, styled } from "@mui/material";
import { FC } from "react";
import { EditableText } from "../../../components/EditableText";
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

export const TaskCard: FC<Props> = ({ task }) => {
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const onTaskNameChange = (newTaskName: string) => {
    updateTask({ id: task.id, taskName: newTaskName });
  };

  const onCheckTask = () => {
    deleteTask({ id: task.id.toString() });
  };

  return (
    <TaskCardContainer>
      <FormControlLabel
        label={
          <EditableText
            displayAs="h3"
            initialValue={task.taskName}
            onSave={onTaskNameChange}
          />
        }
        control={<Checkbox onClick={onCheckTask} />}
      />
    </TaskCardContainer>
  );
};
