import { styled } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/Button";
import { ControlledTextField } from "../../components/ControlledTextField";
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
  gap: theme.spacing(1),
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
      <ControlledTextField
        control={control}
        name="email"
        type="email"
        label="Email"
        onKeyDown={onKeyDown}
      />

      <ControlledTextField
        control={control}
        name="password"
        label="Password"
        type="password"
        onKeyDown={onKeyDown}
      />

      <ControlledTextField
        control={control}
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        onKeyDown={onKeyDown}
      />

      {error ? <ErrorText>{error}</ErrorText> : null}
      <Button variant="contained" onClick={onSignUpClick} disabled={isLoading}>
        Sign Up
      </Button>
    </SignUpFormContainer>
  );
};
