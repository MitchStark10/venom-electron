import styled from "@emotion/styled";
import { Task, Upcoming } from "@mui/icons-material";
import TodayIcon from "@mui/icons-material/Today";
import { SidebarMenuItem } from "./SidebarMenuItem";

// TODO: Define theme
const SidebarContainer = styled.span({
  display: "flex",
  flexDirection: "column",
  width: "250px",
  backgroundColor: "#2f2f2f",
  color: "#fff",
  padding: "20px",
  height: "100vh",
});

export const SideBar = () => {
  return (
    <SidebarContainer>
      <SidebarMenuItem icon={<TodayIcon />} title="Today" />
      <SidebarMenuItem icon={<Upcoming />} title="Upcoming" />
      <SidebarMenuItem icon={<Task />} title="Completed" />
      TODO: Load projects
    </SidebarContainer>
  );
};
