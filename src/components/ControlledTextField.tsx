import { TextField } from "@mui/material";
import { FC, KeyboardEventHandler } from "react";
import { Control, Controller } from "react-hook-form";

interface Props {
  control: Control<any>;
  name: string;
  label: string;
  type?: string;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  fullWidth?: boolean;
}

export const ControlledTextField: FC<Props> = ({
  control,
  name,
  label,
  type,
  onKeyDown,
  fullWidth,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <TextField
          label={label}
          type={type}
          onChange={onChange}
          value={value}
          onKeyDown={onKeyDown}
          fullWidth={fullWidth}
        />
      )}
    />
  );
};
