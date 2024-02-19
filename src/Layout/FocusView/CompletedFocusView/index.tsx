import { Button } from "@mui/material";
import { useEffect } from "react";
import { SectionDivider } from "../../../components/SectionDivider";
import {
  useCompletedTasksQuery,
  useDeleteCompletedTasksMutation,
} from "../../../store/slices/taskSlice";
import { Task } from "../../../types/Task";
import { TaskCard } from "../ListFocusView/TaskCard";

export const CompletedFocusView = () => {
  const { data: completedTasks, refetch } = useCompletedTasksQuery();
  const [deleteAllCompletedTasks] = useDeleteCompletedTasksMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const tasksGroupedByList = completedTasks?.reduce<Record<number, Task[]>>(
    (acc, task) => {
      if (task.list) {
        if (acc[task.list.id]) {
          acc[task.list.id].push(task);
        } else {
          acc[task.list.id] = [task];
        }
      }
      return acc;
    },
    {}
  );

  return (
    <div>
      <h1>Completed</h1>
      {Object.entries(tasksGroupedByList || {}).map(([listId, tasks]) => {
        return (
          <div key={listId}>
            <SectionDivider>{tasks[0].list?.listName}</SectionDivider>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        );
      })}
      <Button variant="contained" onClick={() => deleteAllCompletedTasks()}>
        Delete All Tasks
      </Button>
    </div>
  );
};
