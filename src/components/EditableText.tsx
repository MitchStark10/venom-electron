import { TextField, styled } from "@mui/material";
import { FC, ReactNode, useEffect, useState } from "react";

interface Props {
  label: string;
  initialValue?: string;
  onSave: (newText: string) => void;
  displayAs: "h1" | "h3";
  displayIcon?: ReactNode;
}

export const EditableText: FC<Props> = ({
  label,
  displayAs,
  initialValue,
  displayIcon,
  onSave,
}) => {
  const TextContainer = styled(displayAs)({
    cursor: "pointer",
  });
  const [isEditingText, setIsEditingText] = useState(false);
  const [newText, setNewText] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewText(e.target.value);
  };

  const onTextContainerClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditingText(true);
  };

  const onBlur = () => {
    if (newText) {
      onSave(newText);
    }

    setIsEditingText(false);
  };

  useEffect(() => {
    setNewText(initialValue);
  }, [initialValue]);

  return isEditingText ? (
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
      fullWidth
    />
  ) : (
    <TextContainer onClick={onTextContainerClick}>
      {displayIcon}
      {newText}
    </TextContainer>
  );
};
