import { styled } from "@mui/material";
import { SideBar } from "./Sidebar";

const StyledLayout = styled("div")(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[600]
      : theme.palette.grey[50],
  display: "flex",
  flexDirection: "row",
}));

export const Layout = () => {
  return (
    <StyledLayout>
      <SideBar />
      <p>TODO: Content in the layout</p>
    </StyledLayout>
  );
};
