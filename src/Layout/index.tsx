import { Box, styled } from "@mui/material";
import { getAuthToken } from "../lib/authToken";
import { FocusView } from "./FocusView";
import { NewTaskForm } from "./FocusView/ListFocusView/NewTaskForm";
import { LoginSignUp } from "./LoginSignUp";
import { ModalEntryPoint } from "./Modal/ModalEntryPoint";
import { SideBar } from "./Sidebar";

const StyledLayout = styled("div")(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[600]
      : theme.palette.grey[50],
  display: "flex",
  flexDirection: "row",
  width: "100vw",
  height: "100vh",
}));

export const Layout = () => {
  if (!getAuthToken()) {
    return (
      <StyledLayout>
        <LoginSignUp />
      </StyledLayout>
    );
  }

  const onAddNewTask = () => {
    setTimeout(
      () => (window as any)?.subscribe.sendCloseAndRefreshTasks(),
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

  return (
    <StyledLayout>
      <SideBar />
      <FocusView />
      <ModalEntryPoint />
    </StyledLayout>
  );
};
