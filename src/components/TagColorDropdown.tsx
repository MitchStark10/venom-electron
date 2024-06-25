import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { FC } from "react";

interface Props {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
}

export const TagColorDropdown: FC<Props> = ({ value, onChange }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      fullWidth
      MenuProps={{ disablePortal: true }}
    >
      <MenuItem value="blue">Blue</MenuItem>
      <MenuItem value="orange">Orange</MenuItem>
      <MenuItem value="red">Red</MenuItem>
      <MenuItem value="green">Green</MenuItem>
    </Select>
  );
};
