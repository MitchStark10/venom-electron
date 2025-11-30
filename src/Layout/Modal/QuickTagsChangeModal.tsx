import { Box, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { TagDropdown } from "../../components/TagDropdown";
import { setIsModalOpen, setModalView } from "../../store/slices/modalSlice";
import { useUpdateTaskMutation } from "../../store/slices/taskSlice";
import { RootState } from "../../store/store";
import { Tag } from "../../types/Tag";
import { Task } from "../../types/Task";
import { ModalTitle } from "./ModalTitle";

export const QuickTagsChangeModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const { selectedTask } = useSelector(
    (state: RootState) => state.focusView,
    shallowEqual
  );
  const [updateTask] = useUpdateTaskMutation();
  const dispatch = useDispatch();
  const [pendingTags, setPendingTags] = useState<Tag[]>([]);

  const currentTags = selectedTask?.taskTag?.map((tt) => tt.tag) ?? [];

  useEffect(() => {
    if (!selectedTask) {
      dispatch(setIsModalOpen(false));
      dispatch(setModalView(null));
    }
  }, [selectedTask, dispatch]);

  useEffect(() => {
    setPendingTags(currentTags);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(setIsModalOpen(false));
        dispatch(setModalView(null));
      } else if (event.key === "Enter" && !isLoading) {
        event.preventDefault();
        handleSaveAndClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, isLoading, pendingTags]);

  const handleTagsChange = (tags: Tag[]) => {
    setPendingTags(tags);
  };

  const handleSaveAndClose = async () => {
    if (!selectedTask || isLoading) return;

    setIsLoading(true);

    try {
      const updatedTask: Task = {
        ...selectedTask,
        tagIds: pendingTags.map((t) => t.id),
      };

      await updateTask(updatedTask);

      dispatch(setIsModalOpen(false));
      dispatch(setModalView(null));
    } catch (error) {
      console.error("Failed to update task tags:", error);
    } finally {
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

      <TagDropdown value={pendingTags} onChange={handleTagsChange} autoFocus autoHighlight  />
    </Box>
  );
};
