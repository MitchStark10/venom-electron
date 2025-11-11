import { Box, Button, useTheme } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setIsModalOpen, setModalView } from "../../store/slices/modalSlice";
import { useUpdateTaskMutation } from "../../store/slices/taskSlice";
import { RootState } from "../../store/store";
import { Task } from "../../types/Task";
import { ModalTitle } from "./ModalTitle";

export const QuickDueDateModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const { selectedTask } = useSelector(
    (state: RootState) => state.focusView,
    shallowEqual
  );
  const [updateTask] = useUpdateTaskMutation();
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState<Moment | null>(
    selectedTask?.dueDate ? moment(selectedTask.dueDate) : moment()
  );
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close modal if no task is selected
  useEffect(() => {
    if (!selectedTask) {
      dispatch(setIsModalOpen(false));
      dispatch(setModalView(null));
    }
  }, [selectedTask, dispatch]);

  // Auto-focus the calendar when modal opens
  useEffect(() => {
    if (calendarRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (calendarRef.current) {
          // Try to find the selected date button (has aria-selected="true")
          let dateButton = calendarRef.current.querySelector<HTMLElement>(
            'button[role="gridcell"][aria-selected="true"]'
          );
          
          // If no date is selected, find today's date button
          if (!dateButton) {
            const today = moment().format("YYYY-MM-DD");
            dateButton = calendarRef.current.querySelector<HTMLElement>(
              `button[role="gridcell"][data-timestamp]`
            );
          }
          
          // Fallback to any date button in the calendar grid
          if (!dateButton) {
            dateButton = calendarRef.current.querySelector<HTMLElement>(
              'button[role="gridcell"]:not([disabled])'
            );
          }
          
          if (dateButton) {
            dateButton.focus();
          }
        }
      }, 100);
    }
  }, []);

  const handleDateChange = async (newDate: Moment | null) => {
    if (!selectedTask || isLoading) return;

    setSelectedDate(newDate);
    setIsLoading(true);

    try {
      const updatedTask: Task = {
        ...selectedTask,
        dueDate: newDate ? newDate.startOf("day").toISOString() : null,
      };

      await updateTask(updatedTask);
      
      // Close modal after successful save
      dispatch(setIsModalOpen(false));
      dispatch(setModalView(null));
    } catch (error) {
      console.error("Failed to update task due date:", error);
      setIsLoading(false);
    }
  };

  const handleClearDate = async () => {
    await handleDateChange(null);
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
      }}
    >
      <ModalTitle>Quick Edit: {selectedTask.taskName}</ModalTitle>
      
      <Box ref={calendarRef}>
        <StaticDatePicker
          value={selectedDate}
          onChange={handleDateChange}
          disabled={isLoading}
          displayStaticWrapperAs="desktop"
          slotProps={{
            actionBar: {
              actions: [],
            },
          }}
        />
      </Box>

      <Button 
        variant="text" 
        size="small"
        onClick={handleClearDate}
        disabled={isLoading}
        sx={{ alignSelf: "center" }}
      >
        Clear Date
      </Button>
    </Box>
  );
};