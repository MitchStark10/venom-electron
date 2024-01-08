import { MenuItem, styled } from "@mui/material";
import { FC, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FocusViewOptions,
  setFocusView,
  setSelectedListId,
} from "../../store/slices/focusViewSlice";
import { RootState } from "../../store/store";

interface Props {
  icon: ReactNode;
  title: string;
  focusViewToSelect?: FocusViewOptions;
  listId?: number;
  onClick?: () => void;
}

const MenuItemContainer = styled(MenuItem)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const MenuItemTitle = styled("h4")<{ isSelected: boolean }>(
  ({ isSelected }) => ({
    margin: 0,
    padding: 0,
    textDecoration: isSelected ? "underline" : "none",
    fontWeight: isSelected ? "bold" : "normal",
  })
);

export const SidebarMenuItem: FC<Props> = ({
  icon,
  title,
  focusViewToSelect,
  listId,
  onClick,
}) => {
  const { focusView, selectedListId } = useSelector(
    (state: RootState) => state.focusView
  );

  const dispatch = useDispatch();

  const internalOnClick = () => {
    if (focusViewToSelect) {
      dispatch(setFocusView(focusViewToSelect));
    }

    dispatch(setSelectedListId(listId));
  };

  const isListViewSelected = Boolean(focusViewToSelect) && focusView === "list";

  const isSelected = isListViewSelected
    ? listId === selectedListId
    : focusView === focusViewToSelect;

  return (
    <MenuItemContainer onClick={onClick ?? internalOnClick}>
      {icon}
      <MenuItemTitle isSelected={isSelected}>{title}</MenuItemTitle>
    </MenuItemContainer>
  );
};
