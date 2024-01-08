import { TaskAlt } from "@mui/icons-material";
import { styled } from "@mui/material";
import { useListsQuery } from "../../store/slices/listSlice";
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
  padding: `${theme.spacing(4)} 0`,
  height: "100vh",
  boxShadow: `3px 0 5px -2px ${theme.palette.grey[700]}`,
  justifyContent: "space-between",
}));

const SidebarMenuContainer = styled("span")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const SideBar = () => {
  const { data: lists } = useListsQuery();

  return (
    <SidebarContainer>
      <SidebarMenuContainer>
        <SidebarCoreMenu />
        {lists?.map((list) => (
          <SidebarMenuItem
            key={list.id}
            icon={<TaskAlt />}
            title={list.listName}
            focusViewToSelect="list"
            listId={list.id}
          />
        ))}
      </SidebarMenuContainer>
      <SidebarToolbar />
    </SidebarContainer>
  );
};
