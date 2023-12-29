import { MenuItem, styled } from "@mui/material";
import { FC, ReactNode } from "react";
import { useDispatch } from "react-redux";
import { FocusViewOptions, setFocusView } from "../../store/focusViewSlice";

interface Props {
  icon: ReactNode;
  title: string;
  focusViewState?: FocusViewOptions;
}

const MenuItemContainer = styled(MenuItem)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const SidebarMenuItem: FC<Props> = ({ icon, title, focusViewState }) => {
  const dispatch = useDispatch();

  const internalOnClick = () => {
    if (focusViewState) {
      dispatch(setFocusView(focusViewState));
    }
  };

  return (
    <MenuItemContainer onClick={internalOnClick}>
      {icon}
      <b>{title}</b>
    </MenuItemContainer>
  );
};
