import moment from "moment";
import { FC } from "react";
import { Control, Controller } from "react-hook-form";
import { CustomDatePickerProps, DatePicker } from "./DatePicker";

interface Props extends CustomDatePickerProps {
  control: Control<any>;
  name: string;
  label: string;
}

export const ControlledDatePicker: FC<Props> = ({
  control,
  name,
  label,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <DatePicker
          label={label}
          value={value ? moment(value) : null}
          onChange={onChange}
          {...props}
        />
      )}
    />
  );
};
