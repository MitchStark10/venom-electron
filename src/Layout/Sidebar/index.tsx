import { Task, TaskAlt, Today, Upcoming } from "@mui/icons-material";
import { Divider, styled } from "@mui/material";
import { projectList } from "../../mockData/projectList";
import { SidebarMenuItem } from "./SidebarMenuItem";

const SidebarContainer = styled("span")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "250px",
  backgroundColor: theme.palette.grey[100],
  padding: `${theme.spacing(4)} 0`,
  height: "100vh",
  borderRight: `1px solid ${theme.palette.grey[300]}`,
  boxShadow: `3px 0 5px -2px ${theme.palette.grey[300]}`,
}));

const DividerWithPadding = styled(Divider)(({ theme }) => ({
  margin: `${theme.spacing(4)} 0 ${theme.spacing(8)} 0 !important`,
}));

export const SideBar = () => {
  return (
    <SidebarContainer>
      <SidebarMenuItem icon={<Today />} title="Today" />
      <SidebarMenuItem icon={<Upcoming />} title="Upcoming" />
      <SidebarMenuItem icon={<Task />} title="Completed" />
      <DividerWithPadding />
      {projectList.map((project) => (
        <SidebarMenuItem
          key={project.id}
          icon={<TaskAlt />}
          title={project.name}
        />
      ))}
    </SidebarContainer>
  );
};
