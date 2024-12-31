import { PlaylistAdd, Settings } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { DividerWithPadding } from "../../components/DividerWithPadding";
import { DEFAULT_MENU_ITEMS_COUNT } from "../../lib/constants";
import { setFocusView } from "../../store/slices/focusViewSlice";
import { useListsQuery } from "../../store/slices/listSlice";
import { setIsModalOpen, setModalView } from "../../store/slices/modalSlice";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const SidebarToolbar = () => {
  const dispatch = useDispatch();
  const { data: lists } = useListsQuery();
  const startingIndex = DEFAULT_MENU_ITEMS_COUNT + (lists ? lists.length : 0);
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
        index={startingIndex}
      />
      <DividerWithPadding />
      <SidebarMenuItem
        title="Settings"
        icon={<Settings />}
        onClick={() => {
          dispatch(setFocusView("settings"));
        }}
        index={startingIndex + 1}
      />
    </span>
  );
};
