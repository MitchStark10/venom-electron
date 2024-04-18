import { Button, CircularProgress } from "@mui/material";
import { FC } from "react";
import { SectionDivider } from "../../../components/SectionDivider";
import { getTaskDueDateText } from "../../../lib/getTaskDueDateText";
import { Task } from "../../../types/Task";
import { TaskCard } from "../ListFocusView/TaskCard";

type GroupByOptions = "date" | "list";

interface Props {
  title: string;
  tasks: Task[];
  isLoading: boolean;
  refetch: () => void;
  deleteAllTasks?: () => void;
  groupByOption?: GroupByOptions;
}

export const TimeBasedFocusView: FC<Props> = ({
  title,
  tasks,
  isLoading,
  deleteAllTasks,
  groupByOption = "list",
}) => {
  const groupedTasks =
    groupByOption === "list"
      ? tasks?.reduce<Record<number, Task[]>>((acc, task) => {
          if (task.list) {
            if (acc[task.list.id]) {
              acc[task.list.id].push(task);
            } else {
              acc[task.list.id] = [task];
            }
          }
          return acc;
        }, {})
      : tasks?.reduce<Record<string, Task[]>>((acc, task) => {
          const taskDueDateText = getTaskDueDateText(task.dueDate);
          if (!acc[taskDueDateText]) {
            acc[taskDueDateText] = [];
          }
          acc[taskDueDateText].push(task);
          return acc;
        }, {});

  return (
    <div>
      <h1>{title}</h1>
      {Object.entries(groupedTasks || {}).map(([key, tasks]) => {
        return (
          <div key={key}>
            <SectionDivider>
              {groupByOption === "list" ? tasks[0].list?.listName : key}
            </SectionDivider>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                showListName={groupByOption === "date"}
              />
            ))}
          </div>
        );
      })}
      {deleteAllTasks && Object.entries(groupedTasks || {}).length > 0 && (
        <Button variant="contained" onClick={() => deleteAllTasks()}>
          Delete All Tasks
        </Button>
      )}
      {isLoading && <CircularProgress />}
      {!isLoading && Object.keys(groupedTasks || {}).length === 0 && (
        <p>No tasks found</p>
      )}
    </div>
  );
};
