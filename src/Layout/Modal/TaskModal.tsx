import { Box, Button, useTheme } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { ControlledTextField } from "../../components/ControlledTextField";
import { VerticalAlignmentContainer } from "../../components/VerticalAlignmentContainer";
import { useUpdateTaskMutation } from "../../store/slices/taskSlice";
import { RootState } from "../../store/store";
import { Task } from "../../types/Task";
import { ModalTitle } from "./ModalTitle";

interface FormData extends Task {
  listId: number;
}

export const TaskModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const task = useSelector((state: RootState) => state.focusView.selectedTask);
  const [updateTask] = useUpdateTaskMutation();

  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: task,
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);

    // Save the task
    await updateTask(data);

    setIsLoading(false);
  });

  return (
    <Box sx={{ padding: theme.spacing(2), display: "flex" }}>
      <ModalTitle>New List</ModalTitle>
      <VerticalAlignmentContainer>
        <ControlledTextField
          control={control}
          name="taskName"
          label="Task Name"
        />
        <Button variant="contained" onClick={onSubmit} disabled={isLoading}>
          Save
        </Button>
      </VerticalAlignmentContainer>
    </Box>
  );
};
