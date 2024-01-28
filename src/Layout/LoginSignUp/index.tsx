import { styled } from "@mui/material";
import { useState } from "react";
import { Button } from "../../components/Button";
import { DividerWithPadding } from "../../components/DividerWithPadding";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";

const LoginSignUpContainer = styled("div")(({ theme }) => ({
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: theme.palette.mode === "light" ? "black" : "white",
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.grey[50]
      : theme.palette.grey[900],
}));

export const LoginSignUp = () => {
  const [formMode, setFormMode] = useState<"login" | "signup">("login");
  return (
    <LoginSignUpContainer>
      {formMode === "login" ? <LoginForm /> : <SignUpForm />}
      <DividerWithPadding
        flexItem
        uniformSpacing
        sx={{ width: "200px", marginX: "auto !important" }}
      />
      <Button
        variant="outlined"
        onClick={() => setFormMode(formMode === "login" ? "signup" : "login")}
      >
        {formMode === "login" ? "Sign Up" : "Log In"}
      </Button>
    </LoginSignUpContainer>
  );
};
