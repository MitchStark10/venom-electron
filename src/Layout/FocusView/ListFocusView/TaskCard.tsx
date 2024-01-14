import { styled } from "@mui/material";
import { FC } from "react";
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
  return (
    <TaskCardContainer>
      <h3>{task.taskName}</h3>
    </TaskCardContainer>
  );
};
