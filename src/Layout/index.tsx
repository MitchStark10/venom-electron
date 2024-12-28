import AddIcon from "@mui/icons-material/Add";
import { Box, Fab, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGlobalShortcut } from "../hooks/useGlobalShortcuts";
import { getAuthToken } from "../lib/authToken";
import { setSelectedTask } from "../store/slices/focusViewSlice";
import { useListsQuery } from "../store/slices/listSlice";
import { setIsModalOpen, setModalView } from "../store/slices/modalSlice";
import { FocusView } from "./FocusView";
import { NewTaskForm } from "./FocusView/ListFocusView/NewTaskForm";
import { LoginSignUp } from "./LoginSignUp";
import { ModalEntryPoint } from "./Modal/ModalEntryPoint";
import { SideBar } from "./Sidebar";

export const StyledLayout = styled("div")(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[50],
  color: theme.palette.mode === "dark" ? "white" : undefined,
  display: "flex",
  flexDirection: "row",
  width: "100vw",
  height: "100vh",
}));

const FocusContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: theme.spacing(2),
  overflowY: "auto",
}));

const PositionedFab = styled(Fab)({
  position: "fixed",
  bottom: 40,
  right: 40,
});

export const Layout = () => {
  const { data: lists, refetch: refetchLists } = useListsQuery(undefined, {
    skip: !getAuthToken(),
  });
  const [focusedSection, setFocusedSection] = useState<"navbar" | "view">(
    "view"
  );
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const dispatch = useDispatch();

  const onAddNewTask = () => {
    setTimeout(
      () => (window as any)?.subscribe?.sendCloseAndRefreshTasks(),
      1000
    );
  };

  const isNewTaskOnly = (global as any)?.appInfo?.isNewTaskOnly;

  const handleAddButtonClick = () => {
    if (lists?.length === 0) {
      dispatch(setModalView("newList"));
      dispatch(setIsModalOpen(true));
    } else {
      dispatch(setSelectedTask(null));
      dispatch(setModalView("task"));
      dispatch(setIsModalOpen(true));
    }
  };

  useGlobalShortcut("ArrowUp", () => setFocusedIndex(focusedIndex - 1), {
    requireCtrlOrCmd: false,
  });
  useGlobalShortcut("ArrowDown", () => setFocusedIndex(focusedIndex + 1), {
    requireCtrlOrCmd: false,
  });
  useGlobalShortcut("n", handleAddButtonClick);

  useEffect(() => {
    const interval = setInterval(() => {
      if (getAuthToken()) {
        refetchLists();
      }
    }, 1000 * 60 * 10);

    return () => {
      clearInterval(interval);
    };
  }, [refetchLists]);

  if (!getAuthToken()) {
    return (
      <StyledLayout>
        <LoginSignUp />
      </StyledLayout>
    );
  }

  if (isNewTaskOnly) {
    return (
      <StyledLayout>
        <Box sx={{ padding: "10px" }}>
          <NewTaskForm onAddNewTask={onAddNewTask} />
        </Box>
      </StyledLayout>
    );
  }

  return (
    <StyledLayout>
      <SideBar />
      <FocusContainer>
        <FocusView />
      </FocusContainer>
      <ModalEntryPoint />
      <PositionedFab
        color="primary"
        aria-label="add"
        onClick={handleAddButtonClick}
      >
        <AddIcon />
      </PositionedFab>
    </StyledLayout>
  );
};
