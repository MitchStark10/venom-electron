import { useUpcomingTasksQuery } from "../../../store/slices/taskSlice";
import { TimeBasedFocusView } from "../TimeBasedFocusView";

export const UpcomingFocusView = () => {
  const { data: upcomingTasks, isLoading } = useUpcomingTasksQuery();

  return (
    <TimeBasedFocusView
      isLoading={isLoading}
      title="Upcoming"
      tasks={upcomingTasks || []}
      groupByOption="date"
    />
  );
};
