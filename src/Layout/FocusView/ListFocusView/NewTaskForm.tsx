import { Autocomplete, TextField, styled } from "@mui/material";
import moment, { Moment } from "moment";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../../../components/Button";
import { useListsQuery } from "../../../store/slices/listSlice";
import { useCreateTaskMutation } from "../../../store/slices/taskSlice";
import { List } from "../../../types/List";
import { MobileDatePicker } from "@mui/x-date-pickers";

interface Props {
  onAddNewTask: () => void;
  listId?: number;
}

interface NewTaskFormData {
  taskName: string;
  listId?: number;
  dueDate?: Moment;
  tagIds?: number[];
}

const NewTaskFormContainer = styled("form")({
  width: "fit-content",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
});

export const NewTaskForm: FC<Props> = ({ onAddNewTask, listId }) => {
  const [hasInitalizedFromLocalStorage, setHasInitalizedFromLocalStorage] =
    useState(false);
  const { control, handleSubmit, setValue } = useForm<NewTaskFormData>();
  const [createTask] = useCreateTaskMutation();
  const { data: lists } = useListsQuery();

  const onClick = handleSubmit(({ taskName, listId: formListId, dueDate }) => {
    const payloadListId = listId || formListId;
    if (!payloadListId) {
      toast.error("List is required");
      return;
    }
    onAddNewTask();
    createTask({
      taskName,
      listId: payloadListId,
      dueDate: dueDate?.startOf("day").toISOString(),
    });
  });

  useEffect(() => {
    const listIdFromLocalStorage = localStorage.getItem(
      "newTaskQuickFormListId"
    )
      ? parseInt(localStorage.getItem("newTaskQuickFormListId") || "")
      : undefined;

    if (!hasInitalizedFromLocalStorage) {
      setHasInitalizedFromLocalStorage(true);
      setValue("dueDate", moment());
      if (listIdFromLocalStorage) {
        setValue("listId", listIdFromLocalStorage);
      }
    }
  }, [setValue, hasInitalizedFromLocalStorage]);

  return (
    <NewTaskFormContainer autoComplete="off">
      {!listId && (
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
                    autoComplete="off"
                    fullWidth
                  />
                )}
              />
            );
          }}
        />
      )}
      <Controller
        control={control}
        name="taskName"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Task Name"
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
            autoComplete="off"
            InputProps={{ autoComplete: "off" }}
            inputProps={{ autoComplete: "off" }}
            fullWidth
          />
        )}
      />
      <Controller
        control={control}
        name="dueDate"
        render={({ field: { onChange, value } }) => (
          <MobileDatePicker
            label="Due Date"
            sx={{ width: "100%" }}
            value={value}
            onChange={onChange}
            slotProps={{
              dialog: {
                sx: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  margin: 0,
                  width: "320px",
                  height: "450px",
                  ".MuiDialogContent-root": {
                    overflow: "hidden",
                    padding: 0,
                  },
                },
              },
            }}
          />
        )}
      />

      <Button variant="contained" onClick={onClick}>
        Add Task
      </Button>
    </NewTaskFormContainer>
  );
};
