import { CircularProgress } from "@mui/material";
import { SectionDivider } from "../../../components/SectionDivider";
import { Title } from "../../../components/Title";
import { useStandupTasksQuery } from "../../../store/slices/taskSlice";
import { useSettingsQuery } from "../../../store/slices/userSlice";
import { TaskCard } from "../ListFocusView/TaskCard";

const NoTasksToReport = () => <div>No tasks to report</div>;

export const StandupFocusView = () => {
  const { data: standupTasks, isLoading } = useStandupTasksQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: settingsData } = useSettingsQuery();

  if (isLoading) {
    return <CircularProgress />;
  }

  const isTodayMonday = new Date().getDay() === 1;
  const yesterdayText =
    isTodayMonday && settingsData?.dailyReportIgnoreWeekends
      ? "Friday"
      : "Yesterday";

  let index = 0;

  return (
    <div>
      <Title>Daily Report</Title>
      <div>
        <SectionDivider>{yesterdayText}</SectionDivider>
        {standupTasks?.yesterday.length === 0 && <NoTasksToReport />}
        {standupTasks?.yesterday.map((task) => (
          <TaskCard key={task.id} task={task} showListName index={index++} />
        ))}
      </div>
      <div>
        <SectionDivider>Today</SectionDivider>
        {standupTasks?.today.length === 0 && <NoTasksToReport />}
        {standupTasks?.today.map((task) => (
          <TaskCard key={task.id} task={task} showListName index={index++} />
        ))}
      </div>
      <div>
        <SectionDivider>Blocked</SectionDivider>
        {standupTasks?.blocked.length === 0 && <div>No blocked tasks</div>}
        {standupTasks?.blocked.map((task) => (
          <TaskCard key={task.id} task={task} showListName index={index++} />
        ))}
      </div>
    </div>
  );
};
