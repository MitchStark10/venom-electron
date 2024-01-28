import { TextField, styled } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../components/Button";
import { ErrorText } from "../../components/ErrorText";
import { FormHeader } from "../../components/FormHeader";
import { writeAuthToken } from "../../lib/authToken";
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
  const { control, handleSubmit, getValues } = useForm<LoginFormData>();
  const [error, setError] = useState<string | null>(null);
  const [login, { isLoading, isError }] = useLoginMutation();

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const { email, password } = getValues();
      if (email && password) {
        onLoginClick();
      }
    }
  };

  const onLoginClick = handleSubmit(async (formData) => {
    const response = await login(formData);

    if (isResponseErrorType(response)) {
      if (hasNestedError(response)) {
        setError(response.error.data.error);
      } else {
        setError("Error logging in");
      }
      return;
    }

    writeAuthToken(response.data.token);
    document.location.reload();
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
            onKeyDown={onKeyDown}
            sx={{ width: "250px" }}
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
            onKeyDown={onKeyDown}
            sx={{ width: "250px" }}
          />
        )}
      />
      {error ? <ErrorText>{error}</ErrorText> : null}
      <Button
        variant="contained"
        onClick={onLoginClick}
        loading={isLoading && !isError}
      >
        Log In
      </Button>
    </LoginFormContainer>
  );
};
