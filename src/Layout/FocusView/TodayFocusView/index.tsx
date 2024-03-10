import { useTodayTasksQuery } from "../../../store/slices/taskSlice";
import { TimeBasedFocusView } from "../TimeBasedFocusView";

export const TodayFocusView = () => {
  const { data: todayTasks, isLoading, refetch } = useTodayTasksQuery();

  return (
    <TimeBasedFocusView
      isLoading={isLoading}
      title="Today"
      tasks={todayTasks || []}
      refetch={refetch}
    />
  );
};
