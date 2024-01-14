import SettingsIcon from "@mui/icons-material/Settings";
import { MenuItem, MenuList, Paper, Popper, styled } from "@mui/material";
import { FC, ReactNode, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FocusViewOptions,
  setFocusView,
  setSelectedListId,
} from "../../store/slices/focusViewSlice";
import { useDeleteListMutation } from "../../store/slices/listSlice";
import { RootState } from "../../store/store";

interface Props {
  icon: ReactNode;
  title: string;
  focusViewToSelect?: FocusViewOptions;
  listId?: number;
  onClick?: () => void;
  includeMenu?: boolean;
}

const MenuItemContainer = styled(MenuItem)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
});

const TitleAndIconContainer = styled("span")({
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
  includeMenu,
}) => {
  const { focusView, selectedListId } = useSelector(
    (state: RootState) => state.focusView
  );
  const [showEllipsis, setShowEllipsis] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const popperRef = useRef<HTMLDivElement>(null);
  const [deleteList] = useDeleteListMutation();

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

  const onDeleteList = () => {
    if (listId) {
      deleteList({ id: listId.toString() });
    }
    setShowEllipsis(false);
  };

  return (
    <MenuItemContainer
      onClick={onClick ?? internalOnClick}
      onMouseEnter={() => includeMenu && setShowEllipsis(true)}
      onMouseLeave={() => {
        setShowEllipsis(false);
        setShowMenu(false);
      }}
    >
      <TitleAndIconContainer>
        {icon}
        <MenuItemTitle isSelected={isSelected}>{title}</MenuItemTitle>
      </TitleAndIconContainer>
      <span ref={popperRef}>
        <SettingsIcon
          onClick={() => setShowMenu(true)}
          sx={{ visibility: showEllipsis ? "visible" : "hidden" }}
        />
      </span>
      {showMenu && includeMenu && (
        <Popper open anchorEl={popperRef.current}>
          <Paper>
            <MenuList>
              <MenuItem onClick={onDeleteList}>Delete</MenuItem>
            </MenuList>
          </Paper>
        </Popper>
      )}
    </MenuItemContainer>
  );
};
