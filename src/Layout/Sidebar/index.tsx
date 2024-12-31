import { TaskAlt } from "@mui/icons-material";
import { styled } from "@mui/material";
import { Draggable } from "react-drag-reorder";
import { DEFAULT_MENU_ITEMS_COUNT } from "../../lib/constants";
import {
  useListsQuery,
  useReorderListsMutation,
} from "../../store/slices/listSlice";
import { SidebarCoreMenu } from "./SidebarCoreMenu";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarToolbar } from "./SidebarToolbar";

const SidebarContainer = styled("span")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "250px",
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[900]
      : theme.palette.grey[100],
  color:
    theme.palette.mode === "dark"
      ? theme.palette.grey[300]
      : theme.palette.grey[900],
  padding: `${theme.spacing(1)} 0`,
  height: "100vh",
  overflowY: "auto",
  boxShadow: `3px 0 5px -2px ${theme.palette.grey[700]}`,
  justifyContent: "space-between",
}));

const SidebarMenuContainer = styled("span")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const SideBar = () => {
  const { data: lists } = useListsQuery();
  const [reorderLists] = useReorderListsMutation();

  const onReorder = (prevPos: number, newPos: number) => {
    const listsCopy = [...lists!];
    const [removed] = listsCopy.splice(prevPos, 1);
    listsCopy.splice(newPos, 0, removed);
    const reorderedLists = listsCopy.map((list, index) => ({
      ...list,
      order: index,
    }));
    reorderLists(reorderedLists);
  };

  return (
    <SidebarContainer className="sidebar">
      <SidebarMenuContainer>
        <SidebarCoreMenu />
        {lists && lists.length > 0 && (
          <Draggable
            key={lists?.map((l) => l.listName).join("-")}
            onPosChange={onReorder}
          >
            {lists?.map((list, index) => (
              <SidebarMenuItem
                key={list.id + list.listName}
                icon={<TaskAlt />}
                title={list.listName}
                focusViewToSelect="list"
                listId={list.id}
                includeMenu
                index={index + DEFAULT_MENU_ITEMS_COUNT}
              />
            ))}
          </Draggable>
        )}
      </SidebarMenuContainer>
      <SidebarToolbar />
    </SidebarContainer>
  );
};
