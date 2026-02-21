import { TaskAlt } from "@mui/icons-material";
import { styled } from "@mui/material";
import { DEFAULT_MENU_ITEMS_COUNT } from "../../lib/constants";
import {
  useListsQuery,
  useReorderListsMutation,
} from "../../store/slices/listSlice";
import { SidebarCoreMenu } from "./SidebarCoreMenu";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarToolbar } from "./SidebarToolbar";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { Draggable } from "../../components/Draggable";
import { useDndSensors } from "../../hooks/useDndSensors";
import { List } from "../../types/List";

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
  const [activeList, setActiveList] = useState<List | null>(null);
  const sensors = useDndSensors();

  const handleDragStart = (event: DragStartEvent) => {
    const list = lists?.find((l) => String(l.id) === event.active.id);
    if (list) {
      setActiveList(list);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveList(null);

    if (over && active.id !== over.id) {
      const oldIndex = lists!.findIndex((l) => String(l.id) === active.id);
      const newIndex = lists!.findIndex((l) => String(l.id) === over.id);

      const newLists = arrayMove(lists!, oldIndex, newIndex).map(
        (list, index) => ({
          ...list,
          order: index,
        })
      );

      reorderLists(newLists);
    }
  };

  return (
    <SidebarContainer className="sidebar">
      <SidebarMenuContainer>
        <SidebarCoreMenu />
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={lists?.map((l) => String(l.id)) || []}
            strategy={verticalListSortingStrategy}
          >
            {lists?.map((list, index) => (
              <Draggable key={list.id} id={String(list.id)}>
                <SidebarMenuItem
                  key={list.id + list.listName}
                  icon={<TaskAlt />}
                  title={list.listName}
                  focusViewToSelect="list"
                  listId={list.id}
                  includeMenu
                  index={index + DEFAULT_MENU_ITEMS_COUNT}
                />
              </Draggable>
            ))}
          </SortableContext>
          <DragOverlay>
            {activeList ? (
              <SidebarMenuItem
                icon={<TaskAlt />}
                title={activeList.listName}
                index={0}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </SidebarMenuContainer>
      <SidebarToolbar />
    </SidebarContainer>
  );
};
