import { CircularProgress } from "@mui/material";
import { SectionDivider } from "../../../components/SectionDivider";
import { useStandupTasksQuery } from "../../../store/slices/taskSlice";
import { TaskCard } from "../ListFocusView/TaskCard";
import { Title } from "../../../components/Title";

export const StandupFocusView = () => {
  const { data: standupTasks, isLoading } = useStandupTasksQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Title>Standup</Title>
      <div>
        <SectionDivider>Yesterday</SectionDivider>
        {standupTasks?.yesterday.length === 0 && (
          <div>No tasks from yesterday</div>
        )}
        {standupTasks?.yesterday.map((task) => (
          <TaskCard key={task.id} task={task} showListName />
        ))}
      </div>
      <div>
        <SectionDivider>Today</SectionDivider>
        {standupTasks?.today.length === 0 && <div>No tasks for today</div>}
        {standupTasks?.today.map((task) => (
          <TaskCard key={task.id} task={task} showListName />
        ))}
      </div>
      <div>
        <SectionDivider>Blocked</SectionDivider>
        {standupTasks?.blocked.length === 0 && <div>No blocked tasks</div>}
        {standupTasks?.blocked.map((task) => (
          <TaskCard key={task.id} task={task} showListName />
        ))}
      </div>
    </div>
  );
};
