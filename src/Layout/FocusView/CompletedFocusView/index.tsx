import {
  useCompletedTasksQuery,
  useDeleteCompletedTasksMutation,
} from "../../../store/slices/taskSlice";
import { TimeBasedFocusView } from "../TimeBasedFocusView";

export const CompletedFocusView = () => {
  const { data: completedTasks, refetch } = useCompletedTasksQuery();
  const [deleteAllCompletedTasks] = useDeleteCompletedTasksMutation();

  return (
    <TimeBasedFocusView
      title="Completed"
      tasks={completedTasks || []}
      refetch={refetch}
      deleteAllTasks={deleteAllCompletedTasks}
    />
  );
};
