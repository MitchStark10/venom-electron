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
  isChecked?: boolean;
  listName?: string;
}

const CheckboxAndLabelContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const CheckboxWithEditableLabel: FC<Props> = ({
  onCheckboxClick,
  inputLabel,
  displayAs = "p",
  initialValue,
  onInputChange,
  isEditing,
  onEditingStateChange,
  isChecked,
  listName,
}) => {
  return (
    <CheckboxAndLabelContainer>
      <Checkbox onClick={onCheckboxClick} checked={isChecked} />
      <EditableText
        label={inputLabel}
        displayAs={displayAs}
        initialValue={initialValue}
        onSave={onInputChange}
        isEditing={isEditing}
        onEditingStateChange={onEditingStateChange}
        listName={listName}
      />
    </CheckboxAndLabelContainer>
  );
};
