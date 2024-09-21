import { Box, Fab, styled } from "@mui/material";
import { getAuthToken } from "../lib/authToken";
import { FocusView } from "./FocusView";
import { NewTaskForm } from "./FocusView/ListFocusView/NewTaskForm";
import { LoginSignUp } from "./LoginSignUp";
import { ModalEntryPoint } from "./Modal/ModalEntryPoint";
import { SideBar } from "./Sidebar";
import AddIcon from "@mui/icons-material/Add";
import { useListsQuery } from "../store/slices/listSlice";
import { useDispatch } from "react-redux";
import { setIsModalOpen, setModalView } from "../store/slices/modalSlice";
import { setSelectedTask } from "../store/slices/focusViewSlice";

const StyledLayout = styled("div")(({ theme }) => ({
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
  const { data: lists } = useListsQuery(undefined, { skip: !getAuthToken() });
  const dispatch = useDispatch();
  if (!getAuthToken()) {
    return (
      <StyledLayout>
        <LoginSignUp />
      </StyledLayout>
    );
  }

  const onAddNewTask = () => {
    setTimeout(
      () => (window as any)?.subscribe?.sendCloseAndRefreshTasks(),
      1000
    );
  };

  const isNewTaskOnly = (global as any)?.appInfo?.isNewTaskOnly;
  if (isNewTaskOnly) {
    return (
      <StyledLayout>
        <Box sx={{ padding: "10px" }}>
          <NewTaskForm onAddNewTask={onAddNewTask} />
        </Box>
      </StyledLayout>
    );
  }

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
