import { useUpcomingTasksQuery } from "../../../store/slices/taskSlice";
import { TimeBasedFocusView } from "../TimeBasedFocusView";

export const UpcomingFocusView = () => {
  const { data: upcomingTasks, isLoading, refetch } = useUpcomingTasksQuery();

  return (
    <TimeBasedFocusView
      isLoading={isLoading}
      title="Upcoming"
      tasks={upcomingTasks || []}
      refetch={refetch}
      groupByOption="date"
    />
  );
};
