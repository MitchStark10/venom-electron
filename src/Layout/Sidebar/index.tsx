import { Task, Today, Upcoming } from "@mui/icons-material";
import { styled } from "@mui/material";
import { SidebarMenuItem } from "./SidebarMenuItem";

const SidebarContainer = styled("span")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "250px",
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(4),
  height: "100vh",
  borderRight: `1px solid ${theme.palette.grey[300]}`,
  boxShadow: `3px 0 5px -2px ${theme.palette.grey[300]}`,
}));

export const SideBar = () => {
  return (
    <SidebarContainer>
      <SidebarMenuItem icon={<Today />} title="Today" />
      <SidebarMenuItem icon={<Upcoming />} title="Upcoming" />
      <SidebarMenuItem icon={<Task />} title="Completed" />
      TODO: Load projects
    </SidebarContainer>
  );
};
