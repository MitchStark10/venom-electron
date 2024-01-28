import { Checkbox, CheckboxProps, styled } from "@mui/material";
import { FC } from "react";
import { EditableText } from "./EditableText";

interface Props {
  onCheckboxClick: CheckboxProps["onClick"];
  inputLabel: string;
  displayAs?: "h1" | "h3";
  initialValue: string;
  onInputChange: (newText: string) => void;
}

const CheckboxAndLabelContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const CheckboxWithEditableLabel: FC<Props> = ({
  onCheckboxClick,
  inputLabel,
  displayAs = "h3",
  initialValue,
  onInputChange,
}) => {
  return (
    <CheckboxAndLabelContainer>
      <Checkbox onClick={onCheckboxClick} />
      <EditableText
        label={inputLabel}
        displayAs={displayAs}
        initialValue={initialValue}
        onSave={onInputChange}
      />
    </CheckboxAndLabelContainer>
  );
};
