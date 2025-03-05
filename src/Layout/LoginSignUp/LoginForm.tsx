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
import {
  useLoginMutation,
  useRequestPasswordResetEmailMutation,
} from "../../store/slices/userSlice";
import { toast } from "react-toastify";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginFormContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(3),
}));

export const LoginForm = () => {
  const { control, handleSubmit, getValues } = useForm<LoginFormData>();
  const [error, setError] = useState<string | null>(null);
  const [isInResetPassword, setIsInResetPassword] = useState(false);
  const [login, { isLoading: isLoginLoading, isError }] = useLoginMutation();
  const [requestPasswordReset, { isLoading: isPasswordResetRequestLoading }] =
    useRequestPasswordResetEmailMutation();

  const isLoading = isLoginLoading || isPasswordResetRequestLoading;

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

  const requestPasswordResetEmail = async () => {
    const { email } = getValues();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    // Send email to user
    const response = await requestPasswordReset({ email });

    if (isResponseErrorType(response)) {
      if (hasNestedError(response)) {
        setError(response.error.data.error);
      } else {
        setError("Error sending email");
      }
      return;
    }

    toast.success("Email sent. Check your inbox for further instructions.");
  };

  return (
    <LoginFormContainer>
      <FormHeader>{isInResetPassword ? "Reset Password" : "Log In"}</FormHeader>
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
      {!isInResetPassword && (
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
      )}
      {error ? <ErrorText>{error}</ErrorText> : null}
      <Button
        variant="contained"
        onClick={isInResetPassword ? requestPasswordResetEmail : onLoginClick}
        loading={isLoading && !isError}
      >
        {isInResetPassword ? "Reset Password" : "Log In"}
      </Button>
      <Button
        variant="text"
        sx={{ textTransform: "none", fontSize: "16px" }}
        onClick={() => setIsInResetPassword(!isInResetPassword)}
      >
        {isInResetPassword
          ? "Remembered your password? Click here to return back to login"
          : "Forgot your password? Click here to reset it."}
      </Button>
    </LoginFormContainer>
  );
};
