import { MenuItem, styled } from "@mui/material";
import { FC, ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
}

const MenuItemContainer = styled(MenuItem)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const SidebarMenuItem: FC<Props> = ({ icon, title }) => {
  return (
    <MenuItemContainer>
      {icon}
      <b>{title}</b>
    </MenuItemContainer>
  );
};
