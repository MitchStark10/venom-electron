import { Label, Task, Today, Upcoming } from "@mui/icons-material";
import { DividerWithPadding } from "../../components/DividerWithPadding";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const SidebarCoreMenu = () => {
  return (
    <>
      <SidebarMenuItem
        icon={<Today />}
        title="Today"
        focusViewToSelect="today"
      />
      <SidebarMenuItem
        icon={<Upcoming />}
        title="Upcoming"
        focusViewToSelect="upcoming"
      />
      <SidebarMenuItem
        icon={<Task />}
        title="Completed"
        focusViewToSelect="completed"
      />
      <DividerWithPadding />
      <SidebarMenuItem icon={<Label />} title="Tags" focusViewToSelect="tags" />
      <DividerWithPadding />
    </>
  );
};
