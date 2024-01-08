import { Button, TextField, styled } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormHeader } from "../../components/FormHeader";
import {
  hasNestedError,
  isResponseErrorType,
} from "../../lib/isResponseErrorType";
import { useLoginMutation } from "../../store/slices/userSlice";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginFormContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(4),
}));

export const LoginForm = () => {
  const { control, handleSubmit } = useForm<LoginFormData>();
  const [error, setError] = useState<string | null>(null);
  const [login] = useLoginMutation();

  const onLoginClick = handleSubmit(async (formData) => {
    const response = await login(formData);

    if (isResponseErrorType(response)) {
      console.error(response.error);
      if (hasNestedError(response)) {
        setError(response.error.error);
      } else {
        setError("Error logging in");
      }
      return;
    }

    localStorage.setItem("authToken", response.data.token);
  });

  return (
    <LoginFormContainer>
      <FormHeader>Log In</FormHeader>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Email"
            type="email"
            onChange={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Password"
            type="password"
            onChange={onChange}
            value={value}
          />
        )}
      />
      {error ? <div>{error}</div> : null}
      <Button variant="contained" onClick={onLoginClick}>
        Log In
      </Button>
    </LoginFormContainer>
  );
};
