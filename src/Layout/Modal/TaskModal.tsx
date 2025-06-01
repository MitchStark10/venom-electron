import { Autocomplete, Box, Button, TextField, useTheme } from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ControlledDatePicker } from "../../components/ControlledDatePicker";
import { ControlledTextField } from "../../components/ControlledTextField";
import { TagDropdown } from "../../components/TagDropdown";
import { setSelectedTask } from "../../store/slices/focusViewSlice";
import { useListsQuery } from "../../store/slices/listSlice";
import { setIsModalOpen, setModalView } from "../../store/slices/modalSlice";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../store/slices/taskSlice";
import { RootState } from "../../store/store";
import { List } from "../../types/List";
import { Tag } from "../../types/Tag";
import { CadenceOptions, Task } from "../../types/Task";
import { ModalTitle } from "./ModalTitle";

interface FormData extends Task {
  listId: number;
  tags: Tag[];
  recurrence?: CadenceOptions | "NONE";
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
        tags: selectedTask.taskTag?.map((taskTag) => taskTag.tag) ?? [],
        recurrence: selectedTask.recurringSchedule?.cadence || "NONE",
      }
    : {
        listId: selectedListId ?? (lists?.[0].id || -1),
        taskName: "",
        dueDate: moment().startOf("day").toISOString(),
        isCompleted: false,
        tags: [],
        recurrence: "NONE",
      };

  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: initialTaskData,
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);

    const payload = {
      ...data,
      tagIds: data.tags.map((tag) => tag.id),
      recurringSchedule:
        data.recurrence === "NONE" ? undefined : { cadence: data.recurrence! },
    };
    // Save the task
    if (selectedTask) {
      await updateTask(payload);
    } else {
      createTask({
        ...payload,
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
        minWidth: "400px",
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
                  fullWidth
                />
              )}
              fullWidth
            />
          );
        }}
      />
      <ControlledTextField
        control={control}
        name="taskName"
        label="Task Name"
        multiline
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        autoComplete="off"
      />
      <ControlledDatePicker
        control={control}
        name="dueDate"
        label="Due Date"
        clearable
      />
      <Controller
        control={control}
        name="recurrence"
        render={({ field: { value, onChange } }) => (
          <TextField
            select
            label="Recurrence"
            value={(value || "NONE").toUpperCase()}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            fullWidth
            SelectProps={{ native: true }}
            sx={{ minWidth: 120 }}
          >
            <option value="NONE">None</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </TextField>
        )}
      />
      <Controller
        control={control}
        name="tags"
        render={({ field: { value, onChange } }) => (
          <TagDropdown value={value} onChange={onChange} />
        )}
      />

      <Button variant="contained" onClick={onSubmit} disabled={isLoading}>
        Save
      </Button>
    </Box>
  );
};
