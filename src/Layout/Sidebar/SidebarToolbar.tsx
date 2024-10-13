import { PlaylistAdd, Settings } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { DividerWithPadding } from "../../components/DividerWithPadding";
import { setFocusView } from "../../store/slices/focusViewSlice";
import { setIsModalOpen, setModalView } from "../../store/slices/modalSlice";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const SidebarToolbar = () => {
  const dispatch = useDispatch();
  return (
    <span>
      <DividerWithPadding />
      <SidebarMenuItem
        title="New List"
        icon={<PlaylistAdd />}
        onClick={() => {
          dispatch(setModalView("newList"));
          dispatch(setIsModalOpen(true));
        }}
      />
      <DividerWithPadding />
      <SidebarMenuItem
        title="Settings"
        icon={<Settings />}
        onClick={() => {
          dispatch(setFocusView("settings"));
        }}
      />
    </span>
  );
};
