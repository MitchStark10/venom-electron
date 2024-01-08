import { styled } from "@mui/material";
import { LoginForm } from "./LoginForm";

const LoginSignUpContainer = styled("div")(({ theme }) => ({
  height: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: theme.palette.mode === "light" ? "black" : "white",
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.grey[50]
      : theme.palette.grey[900],
}));

export const LoginSignUp = () => {
  return (
    <LoginSignUpContainer>
      <LoginForm />
    </LoginSignUpContainer>
  );
};
