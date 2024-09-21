import {
  DesktopDatePickerProps,
  DesktopDatePicker as MuiDatePicker,
} from "@mui/x-date-pickers";
import { Moment } from "moment";
import { FC } from "react";

export interface CustomDatePickerProps extends DesktopDatePickerProps<Moment> {
  clearable?: boolean;
}

export const DatePicker: FC<CustomDatePickerProps> = ({
  clearable,
  slotProps,
  ...props
}) => {
  const slotPropsWrapper = {
    ...slotProps,
  };

  if (clearable) {
    slotPropsWrapper.actionBar = { actions: ["clear"] };
  }

  return <MuiDatePicker slotProps={slotPropsWrapper} {...props} />;
};
