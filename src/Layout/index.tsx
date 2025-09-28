import AddIcon from "@mui/icons-material/Add";
import { Box, Fab, styled } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useGlobalShortcut } from "../hooks/useGlobalShortcuts";
import { useNavigationShortcuts } from "../hooks/useNavigationShortcuts";
import { getAuthToken } from "../lib/authToken";
import { HEADER_HEIGHT } from "../muiTheme";
import { setFocusView, setSelectedTask } from "../store/slices/focusViewSlice";
import { useListsQuery } from "../store/slices/listSlice";
import { setIsModalOpen, setModalView } from "../store/slices/modalSlice";
import { useTodayTasksQuery } from "../store/slices/taskSlice";
import { FocusView } from "./FocusView";
import { NewTaskForm } from "./FocusView/ListFocusView/NewTaskForm";
import { LoginSignUp } from "./LoginSignUp";
import { ModalEntryPoint } from "./Modal/ModalEntryPoint";
import { SideBar } from "./Sidebar";

export const StyledLayout = styled("div", {
  shouldForwardProp: (prop) => prop !== "accountForHeader",
})<{ accountForHeader?: boolean }>(({ theme, accountForHeader = false }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[50],
  color: theme.palette.mode === "dark" ? "white" : undefined,
  display: "flex",
  flexDirection: "row",
  width: "100vw",
  height: accountForHeader ? `calc(100vh - ${HEADER_HEIGHT})` : "100vh",
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
  const { refetch: refetchToday } = useTodayTasksQuery(undefined, {
    skip: !getAuthToken(),
  });

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onAddNewTask = () => {
    setTimeout(
      () => (window as any)?.subscribe?.sendCloseAndRefreshTasks(),
      1000,
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

  useNavigationShortcuts();
  useGlobalShortcut("n", handleAddButtonClick);

  useEffect(() => {
    const onVisbiilityChange = () => {
      if (document.visibilityState === "visible" && getAuthToken()) {
        refetchToday();
        refetchLists();
      }
    };

    document.addEventListener("visibilitychange", onVisbiilityChange);
    window.addEventListener("focus", onVisbiilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisbiilityChange);
      window.removeEventListener("focus", onVisbiilityChange);
    };
  }, [refetchLists]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (getAuthToken()) {
          refetchLists();
        }
      },
      1000 * 60 * 10,
    );

    return () => {
      clearInterval(interval);
    };
  }, [refetchLists]);

  useEffect(() => {
    const isOnDeletePage = location.pathname === "/delete-account";
    if (isOnDeletePage && getAuthToken()) {
      dispatch(setFocusView("settings"));
      navigate("/");
    }
  }, [location.pathname, dispatch, navigate]);

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
      <FocusContainer className="focus-view">
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
