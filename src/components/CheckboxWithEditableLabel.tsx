import { Refresh } from "@mui/icons-material";
import { Checkbox, CheckboxProps, styled } from "@mui/material";
import { FC } from "react";
import { DisplayAs } from "../types/DisplayAs";
import { Tag } from "../types/Tag";
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
  tags?: Tag[];
  preventEdits?: boolean;
  isRecurring?: boolean;
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
  tags,
  preventEdits,
  isRecurring = false,
}) => {
  return (
    <CheckboxAndLabelContainer>
      <Checkbox
        onClick={onCheckboxClick}
        checked={isChecked}
        icon={isRecurring ? <Refresh /> : undefined}
      />

      <EditableText
        label={inputLabel}
        displayAs={displayAs}
        initialValue={initialValue}
        onSave={onInputChange}
        isEditing={isEditing}
        onEditingStateChange={onEditingStateChange}
        listName={listName}
        tags={tags}
        preventEdits={preventEdits}
      />
    </CheckboxAndLabelContainer>
  );
};
