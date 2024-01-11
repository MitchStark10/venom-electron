import { Button, TextField, styled } from "@mui/material";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCreateTaskMutation } from "../../../store/slices/taskSlice";

interface Props {
  onAddNewTask: () => void;
  listId?: number;
}

interface NewTaskFormData {
  taskName: string;
  listId?: number;
}

const NewTaskFormContainer = styled("div")({
  width: "fit-content",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
});

export const NewTaskForm: FC<Props> = ({ onAddNewTask, listId }) => {
  const { control, handleSubmit } = useForm<NewTaskFormData>();
  const [createTask] = useCreateTaskMutation();

  const onClick = handleSubmit(({ taskName, listId: formListId }) => {
    const payloadListId = listId || formListId;
    if (!payloadListId) {
      return;
    }
    onAddNewTask();
    createTask({ taskName, listId: payloadListId });
  });

  return (
    <NewTaskFormContainer>
      <Controller
        control={control}
        name="taskName"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Task Name"
            sx={{ width: "250px" }}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                onClick();
              }
            }}
            value={value}
            onChange={onChange}
          />
        )}
      />
      {!listId && (
        <Controller
          control={control}
          name="listId"
          render={({ field: { onChange, value } }) => (
            <TextField
              label="List Id"
              sx={{ width: "250px" }}
              value={value}
              onChange={onChange}
            />
          )}
        />
      )}

      <Button variant="contained" onClick={onClick}>
        Add Task
      </Button>
    </NewTaskFormContainer>
  );
};
