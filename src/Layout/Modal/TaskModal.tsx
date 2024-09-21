import { Autocomplete, Box, Button, TextField, useTheme } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ControlledDatePicker } from "../../components/ControlledDatePicker";
import { ControlledTextField } from "../../components/ControlledTextField";
import { setSelectedTask } from "../../store/slices/focusViewSlice";
import { useListsQuery } from "../../store/slices/listSlice";
import { setIsModalOpen, setModalView } from "../../store/slices/modalSlice";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../store/slices/taskSlice";
import { RootState } from "../../store/store";
import { List } from "../../types/List";
import { Task } from "../../types/Task";
import { ModalTitle } from "./ModalTitle";
import moment from "moment";

interface FormData extends Task {
  listId: number;
}

export const TaskModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const { selectedTask, selectedListId } = useSelector(
    (state: RootState) => state.focusView,
    shallowEqual
  );
  const [updateTask] = useUpdateTaskMutation();
  const [createTask] = useCreateTaskMutation();
  const { data: lists } = useListsQuery();
  const dispatch = useDispatch();

  const initialTaskData: Partial<FormData> = selectedTask
    ? {
        ...selectedTask,
        listId: selectedTask.listId ?? (lists?.[0].id || -1),
      }
    : {
        listId: selectedListId ?? (lists?.[0].id || -1),
        taskName: "",
        dueDate: moment().startOf("day").toISOString(),
        isCompleted: false,
      };

  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: initialTaskData,
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    // Save the task
    if (selectedTask) {
      await updateTask(data);
    } else {
      createTask({
        ...data,
        dueDate: data.dueDate || undefined,
      });
    }
    setIsLoading(false);
    dispatch(setIsModalOpen(false));
    dispatch(setSelectedTask(null));
    dispatch(setModalView(null));
  });

  return (
    <Box
      sx={{
        padding: theme.spacing(2),
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
      }}
    >
      <ModalTitle>{selectedTask ? "Edit Task" : "New Task"}</ModalTitle>
      <Controller
        control={control}
        name="listId"
        render={({ field: { onChange, value } }) => {
          return (
            <Autocomplete
              options={lists || []}
              getOptionLabel={(option: List) => option.listName}
              style={{ width: 300 }}
              onChange={(_, data) => {
                localStorage.setItem(
                  "newTaskQuickFormListId",
                  data?.id.toString() || ""
                );
                onChange(data?.id);
              }}
              value={(lists || []).find((list) => list.id === value) || null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="List"
                  variant="outlined"
                  value={value}
                />
              )}
            />
          );
        }}
      />
      <ControlledTextField
        control={control}
        name="taskName"
        label="Task Name"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
      <ControlledDatePicker control={control} name="dueDate" label="Due Date" />
      <Button variant="contained" onClick={onSubmit} disabled={isLoading}>
        Save
      </Button>
    </Box>
  );
};
