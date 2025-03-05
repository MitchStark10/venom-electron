import { styled, TextField } from "@mui/material";
import { FormHeader } from "./FormHeader";
import { Controller, useForm } from "react-hook-form";
import { useResetPasswordMutation } from "../store/slices/userSlice";
import { Button } from "./Button";
import { StyledLayout } from "../Layout";
import { useSearchParams } from "react-router";
import { writeAuthToken } from "../lib/authToken";
import { ErrorText } from "./ErrorText";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordFormContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(1),
  margin: "auto",
}));

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const { control, getValues, handleSubmit, setError, formState } =
    useForm<ResetPasswordFormData>({
      defaultValues: {
        password: "",
        confirmPassword: "",
      },
    });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const { password, confirmPassword } = getValues();
      if (password && confirmPassword) {
        onResetPasswordClick();
      }
    }
  };

  const onResetPasswordClick = handleSubmit(
    async ({ password, confirmPassword }) => {
      if (!password || !confirmPassword) {
        setError("password", {
          type: "manual",
          message: "Password is required",
        });
        setError("confirmPassword", {
          type: "manual",
          message: "Confirm password is required",
        });
        return;
      } else if (password !== confirmPassword) {
        setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match",
        });
        return;
      }

      // Reset password logic here
      const response = await resetPassword({
        userId: Number(userId),
        token: token!,
        password,
      });

      if (response.data?.token) {
        writeAuthToken(response.data.token);
        document.location = "/";
      } else {
        console.error("Error resetting password", response.error);
      }
    }
  );

  if (!userId || !token) {
    console.error("Invalid reset password link", {
      userId,
      token,
    });
    return <div>Invalid reset password link</div>;
  }

  return (
    <StyledLayout>
      <ResetPasswordFormContainer>
        <FormHeader>Reset Password</FormHeader>
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
        {formState.errors.password && (
          <ErrorText>{formState.errors.password.message}</ErrorText>
        )}
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
              sx={{ width: "250px" }}
            />
          )}
        />
        {formState.errors.confirmPassword && (
          <ErrorText>{formState.errors.confirmPassword.message}</ErrorText>
        )}
        <Button
          variant="contained"
          onClick={onResetPasswordClick}
          loading={isLoading}
          disabled={!formState.isDirty}
        >
          Reset Passsword
        </Button>
      </ResetPasswordFormContainer>
    </StyledLayout>
  );
};
