import { TextField, styled } from "@mui/material";
import { FC, ReactNode, useEffect, useState } from "react";
import { DisplayAs } from "../types/DisplayAs";

interface Props {
  label: string;
  initialValue?: string;
  onSave: (newText: string) => void;
  displayAs: DisplayAs;
  displayIcon?: ReactNode;
  onEditingStateChange?: (isEditing: boolean) => void;
  isEditing?: boolean;
}

export const EditableText: FC<Props> = ({
  label,
  displayAs,
  initialValue,
  displayIcon,
  onSave,
  onEditingStateChange,
  isEditing,
}) => {
  const TextContainer = styled(displayAs)({
    cursor: "pointer",
  });
  const [localIsEditingText, setLocalIsEditingText] = useState(false);
  const [newText, setNewText] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewText(e.target.value);
  };

  const onTextContainerClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onEditingStateChange?.(true);
    setLocalIsEditingText(true);
  };

  const onBlur = () => {
    if (newText) {
      onSave(newText);
    }

    onEditingStateChange?.(false);
    setLocalIsEditingText(false);
  };

  useEffect(() => {
    setNewText(initialValue);
  }, [initialValue]);

  return isEditing || localIsEditingText ? (
    <TextField
      label={label}
      value={newText}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          onBlur();
        }
      }}
      autoFocus
    />
  ) : (
    <TextContainer onClick={onTextContainerClick}>
      {displayIcon}
      {newText}
    </TextContainer>
  );
};
