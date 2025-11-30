import { styled, useTheme } from "@mui/material";
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

interface LoginSignUpProps {
  onLoginSuccess: () => void;
}

export const LoginSignUp = ({ onLoginSuccess }: LoginSignUpProps) => {
  const [formMode, setFormMode] = useState<"login" | "signup">("login");
  const theme = useTheme();

  return (
    <LoginSignUpContainer>
      {formMode === "login" ? (
        <LoginForm onLoginSuccess={onLoginSuccess} />
      ) : (
        <SignUpForm onLoginSuccess={onLoginSuccess} />
      )}
      <DividerWithPadding
        flexItem
        uniformSpacing
        sx={{ width: "200px", marginX: "auto !important" }}
      />
      <Button
        variant="outlined"
        onClick={() => setFormMode(formMode === "login" ? "signup" : "login")}
        sx={{ mt: theme.spacing(2) }}
      >
        {formMode === "login" ? "Sign Up" : "Log In"}
      </Button>
    </LoginSignUpContainer>
  );
};
