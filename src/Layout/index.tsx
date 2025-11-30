import AddIcon from "@mui/icons-material/Add";
import { Box, Fab, styled } from "@mui/material";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useGlobalShortcut } from "../hooks/useGlobalShortcuts";
import { useNavigationShortcuts } from "../hooks/useNavigationShortcuts";
import { useReorder } from "../hooks/useReorder";
import { getAuthToken } from "../lib/authToken";
import { HEADER_HEIGHT } from "../muiTheme";
import { setFocusView, setSelectedTask } from "../store/slices/focusViewSlice";
import { useListsQuery } from "../store/slices/listSlice";
import { setIsModalOpen, setModalView } from "../store/slices/modalSlice";
import {
  useCompletedTasksQuery,
  useTodayTasksQuery,
  useUpcomingTasksQuery,
  useUpdateTaskMutation,
} from "../store/slices/taskSlice";
import { RootState } from "../store/store";
import { Task } from "../types/Task";
import { FocusView } from "./FocusView";
import { NewTaskForm } from "./FocusView/ListFocusView/NewTaskForm";
import { LoginSignUp } from "./LoginSignUp";
import { ModalEntryPoint } from "./Modal/ModalEntryPoint";
import { SideBar } from "./Sidebar";
import { useTaskSorter } from "../lib/taskSorter";

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
  const { data: todayTasks, refetch: refetchToday } = useTodayTasksQuery(
    undefined,
    {
      skip: !getAuthToken(),
    }
  );
  const { data: upcomingTasks, refetch: refetchUpcoming } =
    useUpcomingTasksQuery(undefined, {
      skip: !getAuthToken(),
    });

  const { refetch: refetchCompleted } = useCompletedTasksQuery(undefined, {
    skip: !getAuthToken(),
  });

  const onReorder = useReorder();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { focusView, selectedListId } = useSelector(
    (state: RootState) => state.focusView
  );
  const [updateTask] = useUpdateTaskMutation();
  const taskSorter = useTaskSorter(
    // groupByOption === "list" ? "listViewOrder" : "combinedViewOrder"
    "listViewOrder"
  );

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

  const getFocusedTask = (): Task | null => {
    const focusedElement = document.activeElement as HTMLElement;
    if (focusedElement && focusedElement.hasAttribute("data-task-id")) {
      const taskId = parseInt(
        focusedElement.getAttribute("data-task-id") || "0"
      );
      const allTasks = [
        ...(lists?.flatMap((l) => l.tasks) || []),
        ...(todayTasks || []),
        ...(upcomingTasks || []),
      ];
      const task = allTasks.find((t) => t.id === taskId);
      if (task) return task;
    }
    return null;
  };

  const handleQuickDueDateEdit = () => {
    const focusedTask = getFocusedTask();
    if (focusedTask) {
      dispatch(setSelectedTask(focusedTask));
      dispatch(setModalView("quickDueDateEdit"));
      dispatch(setIsModalOpen(true));
    }
  };

  const handleQuickListChange = () => {
    const focusedTask = getFocusedTask();
    if (focusedTask) {
      dispatch(setSelectedTask(focusedTask));
      dispatch(setModalView("quickListChange"));
      dispatch(setIsModalOpen(true));
    }
  };

  const handleQuickTagsChange = () => {
    const focusedTask = getFocusedTask();
    if (focusedTask) {
      dispatch(setSelectedTask(focusedTask));
      dispatch(setModalView("quickTagsChange"));
      dispatch(setIsModalOpen(true));
    }
  };

  const handleAddOneDay = () => {
    const focusedTask = getFocusedTask();
    if (focusedTask) {
      const currentDate = focusedTask.dueDate
        ? moment(focusedTask.dueDate)
        : moment();
      const newDate = currentDate.add(1, "day").startOf("day");
      const updatedTask: Task = {
        ...focusedTask,
        dueDate: newDate.toISOString(),
      };
      updateTask(updatedTask);
    }
  };

  const handleSubtractOneDay = () => {
    const focusedTask = getFocusedTask();
    if (focusedTask) {
      const currentDate = focusedTask.dueDate
        ? moment(focusedTask.dueDate)
        : moment();
      const newDate = currentDate.subtract(1, "day").startOf("day");
      const updatedTask: Task = {
        ...focusedTask,
        dueDate: newDate.toISOString(),
      };
      updateTask(updatedTask);
    }
  };

  const handleMoveTask = (direction: "up" | "down") => {
    const focusedTask = getFocusedTask();
    if (!focusedTask) return;

    let tasks: Task[] = [];
    if (focusView === "list") {
      const listTasks = lists?.find((l) => l.id === selectedListId)?.tasks;
      tasks = listTasks ? [...listTasks] : [];
    } else if (focusView === "today") {
      tasks = todayTasks ? [...todayTasks] : [];
    } else if (focusView === "upcoming") {
      tasks = upcomingTasks ? [...upcomingTasks] : [];
    }

    tasks.sort(taskSorter);

    const currentIndex = tasks.findIndex((t) => t.id === focusedTask.id);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < tasks.length) {
      onReorder(currentIndex, newIndex, tasks, focusedTask);
      setFocusedIndex((prev) => (direction === "up" ? prev - 1 : prev + 1));
    }
  };

  const handleMoveTaskUp = () => handleMoveTask("up");
  const handleMoveTaskDown = () => handleMoveTask("down");

  const setFocusedIndex = useNavigationShortcuts();
  useGlobalShortcut("n", handleAddButtonClick);
  useGlobalShortcut("s", handleQuickDueDateEdit, { requireCtrlOrCmd: true });
  useGlobalShortcut("m", handleQuickListChange, { requireCtrlOrCmd: true });
  useGlobalShortcut("t", handleQuickTagsChange, { requireCtrlOrCmd: true });
  useGlobalShortcut("]", handleAddOneDay);
  useGlobalShortcut("[", handleSubtractOneDay);
  useGlobalShortcut("ArrowUp", handleMoveTaskUp, { requireCtrlOrCmd: true });
  useGlobalShortcut("ArrowDown", handleMoveTaskDown, {
    requireCtrlOrCmd: true,
  });

  useEffect(() => {
    const onVisbiilityChange = () => {
      if (document.visibilityState === "visible" && getAuthToken()) {
        refetchToday();
        refetchCompleted();
        refetchUpcoming();
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
      1000 * 60 * 10
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
