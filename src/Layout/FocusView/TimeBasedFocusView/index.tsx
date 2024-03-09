import { Button } from "@mui/material";
import { FC } from "react";
import { SectionDivider } from "../../../components/SectionDivider";
import { Task } from "../../../types/Task";
import { TaskCard } from "../ListFocusView/TaskCard";

interface Props {
  title: string;
  tasks: Task[];
  refetch: () => void;
  deleteAllTasks?: () => void;
}

export const TimeBasedFocusView: FC<Props> = ({
  title,
  tasks,
  refetch,
  deleteAllTasks,
}) => {
  const tasksGroupedByList = tasks?.reduce<Record<number, Task[]>>(
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
      <h1>{title}</h1>
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
      {deleteAllTasks &&
        Object.entries(tasksGroupedByList || {}).length > 0 && (
          <Button variant="contained" onClick={() => deleteAllTasks()}>
            Delete All Tasks
          </Button>
        )}
      {Object.keys(tasksGroupedByList || {}).length === 0 && (
        <p>No tasks found</p>
      )}
    </div>
  );
};
