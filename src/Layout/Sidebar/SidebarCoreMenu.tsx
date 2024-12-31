import { Label, Summarize, Task, Today, Upcoming } from "@mui/icons-material";
import { DividerWithPadding } from "../../components/DividerWithPadding";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const SidebarCoreMenu = () => {
  return (
    <>
      <SidebarMenuItem
        icon={<Today />}
        title="Today"
        focusViewToSelect="today"
        index={0}
      />
      <SidebarMenuItem
        icon={<Upcoming />}
        title="Upcoming"
        focusViewToSelect="upcoming"
        index={1}
      />
      <SidebarMenuItem
        icon={<Summarize />}
        title="Standup"
        focusViewToSelect="standup"
        index={2}
      />
      <SidebarMenuItem
        icon={<Task />}
        title="Completed"
        focusViewToSelect="completed"
        index={3}
      />
      <DividerWithPadding />
      <SidebarMenuItem
        icon={<Label />}
        title="Tags"
        focusViewToSelect="tags"
        index={4}
      />
      <DividerWithPadding />
    </>
  );
};
