import { useTodayTasksQuery } from "../../../store/slices/taskSlice";
import { TimeBasedFocusView } from "../TimeBasedFocusView";

export const TodayFocusView = () => {
  const { data: completedTasks, refetch } = useTodayTasksQuery();

  return (
    <TimeBasedFocusView
      title="Today"
      tasks={completedTasks || []}
      refetch={refetch}
    />
  );
};
