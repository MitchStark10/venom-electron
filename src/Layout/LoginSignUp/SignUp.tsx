import { TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

export const SignUpForm = () => {
  const { control } = useForm();
  return (
    <div>
      Sign Up
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextField label="Email" onChange={onChange} value={value} />
        )}
      />
    </div>
  );
};
