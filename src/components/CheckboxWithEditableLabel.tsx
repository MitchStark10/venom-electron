import { Checkbox, CheckboxProps, styled } from "@mui/material";
import { FC } from "react";
import { DisplayAs } from "../types/DisplayAs";
import { EditableText } from "./EditableText";

interface Props {
  onCheckboxClick: CheckboxProps["onClick"];
  inputLabel: string;
  displayAs?: DisplayAs;
  initialValue: string;
  onInputChange: (newText: string) => void;
  isEditing?: boolean;
  onEditingStateChange?: (isEditing: boolean) => void;
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
  isEditing,
  onEditingStateChange,
}) => {
  return (
    <CheckboxAndLabelContainer>
      <Checkbox onClick={onCheckboxClick} />
      <EditableText
        label={inputLabel}
        displayAs={displayAs}
        initialValue={initialValue}
        onSave={onInputChange}
        isEditing={isEditing}
        onEditingStateChange={onEditingStateChange}
      />
    </CheckboxAndLabelContainer>
  );
};
