import {
  DatePickerProps,
  DatePicker as MuiDatePicker,
} from "@mui/x-date-pickers";
import { Moment } from "moment";
import { FC } from "react";

interface Props extends DatePickerProps<Moment> {
  clearable?: boolean;
}

export const DatePicker: FC<Props> = ({ clearable, slotProps, ...props }) => {
  const slotPropsWrapper = {
    ...slotProps,
  };

  if (clearable) {
    slotPropsWrapper.actionBar = { actions: ["clear"] };
  }

  return <MuiDatePicker slotProps={slotPropsWrapper} {...props} />;
};
