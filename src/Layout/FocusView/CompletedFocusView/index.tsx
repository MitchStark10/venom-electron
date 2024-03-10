import {
  useCompletedTasksQuery,
  useDeleteCompletedTasksMutation,
} from "../../../store/slices/taskSlice";
import { TimeBasedFocusView } from "../TimeBasedFocusView";

export const CompletedFocusView = () => {
  const { data: completedTasks, isLoading, refetch } = useCompletedTasksQuery();
  const [deleteAllCompletedTasks] = useDeleteCompletedTasksMutation();

  return (
    <TimeBasedFocusView
      isLoading={isLoading}
      title="Completed"
      tasks={completedTasks || []}
      refetch={refetch}
      deleteAllTasks={deleteAllCompletedTasks}
    />
  );
};
