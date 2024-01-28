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
import { useSignupMutation } from "../../store/slices/userSlice";

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpFormContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(4),
}));

export const SignUpForm = () => {
  const { control, handleSubmit, getValues } = useForm<SignUpFormData>();
  const [error, setError] = useState<string | null>(null);
  const [signup, { isLoading }] = useSignupMutation();

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const { email, password, confirmPassword } = getValues();
      if (email && password && confirmPassword) {
        onSignUpClick();
      }
    }
  };

  const onSignUpClick = handleSubmit(async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const response = await signup(formData);

    if (isResponseErrorType(response)) {
      if (hasNestedError(response)) {
        setError(response.error.data.error);
      } else {
        setError("Error signing up");
      }
      return;
    }

    writeAuthToken(response.data.token);
    document.location.reload();
  });

  return (
    <SignUpFormContainer>
      <FormHeader>Sign Up</FormHeader>
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
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <TextField
            label="Confirm Password"
            type="password"
            onChange={onChange}
            value={value}
            onKeyDown={onKeyDown}
          />
        )}
      />
      {error ? <ErrorText>{error}</ErrorText> : null}
      <Button variant="contained" onClick={onSignUpClick} disabled={isLoading}>
        Sign Up
      </Button>
    </SignUpFormContainer>
  );
};
