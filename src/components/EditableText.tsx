import { Chip, TextField, styled } from "@mui/material";
import { FC, ReactNode, useEffect, useState } from "react";
import { useTagColors } from "../hooks/useTagColors";
import { DisplayAs } from "../types/DisplayAs";
import { Tag } from "../types/Tag";

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
  tags?: Tag[];
}

const TextAndListContainer = styled("div")(({ theme }) => ({
  margin: `${theme.spacing(0.5)} 0`,
}));

const TagContainer = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: "flex",
  gap: theme.spacing(1),
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
  tags,
}) => {
  const tagColorMap = useTagColors();
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
    console.log("on blur triggered");
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
      {Boolean(tags?.length) && (
        <TagContainer>
          {tags!!.map((tag) => (
            <Chip
              key={tag.id}
              variant="filled"
              label={tag.tagName}
              sx={{
                backgroundColor: tagColorMap.background[tag.tagColor],
                color: tagColorMap.text[tag.tagColor],
                fontWeight: "bold",
              }}
            />
          ))}
        </TagContainer>
      )}
    </TextAndListContainer>
  );
};
