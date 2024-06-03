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
  className?: string;
  listName?: String;
}

const TextAndListContainer = styled("div")(({ theme }) => ({
  margin: `${theme.spacing(0.5)} 0`,
}));

export const EditableText: FC<Props> = ({
  label,
  displayAs,
  initialValue,
  displayIcon,
  onSave,
  onEditingStateChange,
  isEditing,
  className,
  listName,
}) => {
  const TextAndIconContainer = styled(displayAs)({
    cursor: "pointer",
    margin: "2px 0",
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
      fullWidth
      className={className}
    />
  ) : (
    <TextAndListContainer onClick={onTextContainerClick} className={className}>
      <TextAndIconContainer>
        {displayIcon}
        {newText}
      </TextAndIconContainer>
      {Boolean(listName) && (
        <i style={{ fontSize: "12px" }}>
          <b>{listName}</b>
        </i>
      )}
    </TextAndListContainer>
  );
};
