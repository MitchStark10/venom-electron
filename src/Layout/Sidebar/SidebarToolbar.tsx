import { PlaylistAdd } from "@mui/icons-material";
import { DividerWithPadding } from "../../components/DividerWithPadding";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const SidebarToolbar = () => {
  return (
    <span>
      <DividerWithPadding />
      <SidebarMenuItem title="New List" icon={<PlaylistAdd />} />
    </span>
  );
};
