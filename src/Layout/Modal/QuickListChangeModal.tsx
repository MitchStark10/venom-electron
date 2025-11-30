import { Autocomplete, Box, TextField, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useListsQuery } from "../../store/slices/listSlice";
import { setIsModalOpen, setModalView } from "../../store/slices/modalSlice";
import { useUpdateTaskMutation } from "../../store/slices/taskSlice";
import { RootState } from "../../store/store";
import { List } from "../../types/List";
import { Task } from "../../types/Task";
import { ModalTitle } from "./ModalTitle";

export const QuickListChangeModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const { selectedTask } = useSelector(
    (state: RootState) => state.focusView,
    shallowEqual
  );
  const { data: lists } = useListsQuery();
  const [updateTask] = useUpdateTaskMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedTask) {
      dispatch(setIsModalOpen(false));
      dispatch(setModalView(null));
    }
  }, [selectedTask, dispatch]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(setIsModalOpen(false));
        dispatch(setModalView(null));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  const handleListChange = async (list: List | null) => {
    if (!selectedTask || isLoading || !list) return;

    setIsLoading(true);

    try {
      const updatedTask: Task = {
        ...selectedTask,
        listId: list.id,
      };

      await updateTask(updatedTask);

      dispatch(setIsModalOpen(false));
      dispatch(setModalView(null));
    } catch (error) {
      console.error("Failed to update task list:", error);
      setIsLoading(false);
    }
  };

  if (!selectedTask) {
    return null;
  }

  return (
    <Box
      sx={{
        padding: theme.spacing(2),
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(1),
        minWidth: "400px",
      }}
    >
      <ModalTitle>Quick Edit: {selectedTask.taskName}</ModalTitle>

      <Autocomplete
        options={lists || []}
        getOptionLabel={(option: List) => option.listName}
        onChange={(_, data) => {
          handleListChange(data);
        }}
        value={
          (lists || []).find((list) => list.id === selectedTask.listId) || null
        }
        openOnFocus
        autoHighlight
        renderInput={(params) => (
          <TextField
            {...params}
            label="List"
            variant="outlined"
            autoFocus
            fullWidth
          />
        )}
        fullWidth
      />
    </Box>
  );
};
