import { Task, Today, Upcoming } from "@mui/icons-material";
import { DividerWithPadding } from "../../components/DividerWithPadding";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const SidebarCoreMenu = () => {
  return (
    <>
      <SidebarMenuItem icon={<Today />} title="Today" focusViewState="today" />
      <SidebarMenuItem
        icon={<Upcoming />}
        title="Upcoming"
        focusViewState="upcoming"
      />
      <SidebarMenuItem
        icon={<Task />}
        title="Completed"
        focusViewState="completed"
      />
      <DividerWithPadding />
    </>
  );
};
