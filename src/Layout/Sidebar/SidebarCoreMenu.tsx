import { Task, Today, Upcoming } from "@mui/icons-material";
import { DividerWithPadding } from "../../components/DividerWithPadding";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const SidebarCoreMenu = () => {
  return (
    <>
      <SidebarMenuItem icon={<Today />} title="Today" />
      <SidebarMenuItem icon={<Upcoming />} title="Upcoming" />
      <SidebarMenuItem icon={<Task />} title="Completed" />
      <DividerWithPadding />
    </>
  );
};
