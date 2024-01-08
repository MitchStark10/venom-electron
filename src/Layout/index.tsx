import { styled } from "@mui/material";
import { getAuthToken } from "../lib/authToken";
import { FocusView } from "./FocusView";
import { LoginSignUp } from "./LoginSignUp";
import { ModalEntryPoint } from "./Modal/ModalEntryPoint";
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
  if (!getAuthToken()) {
    return (
      <StyledLayout>
        <LoginSignUp />
      </StyledLayout>
    );
  }

  // const params = new URLSearchParams(global.location.search);
  // if (params.get("isNewTaskOnly") === "true") {
  //   return (
  //     <StyledLayout>
  //       <NewTaskForm />
  //     </StyledLayout>
  //   );
  // }

  return (
    <StyledLayout>
      <SideBar />
      <FocusView />
      <ModalEntryPoint />
    </StyledLayout>
  );
};
