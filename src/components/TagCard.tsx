import { Delete, Label } from "@mui/icons-material";
import { IconButton, SelectChangeEvent } from "@mui/material";
import { styled } from "@mui/system";
import { FC, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useClickOutside } from "../hooks/useClickOutside";
import { useTagColors } from "../hooks/useTagColors";
import {
  useDeleteTagMutation,
  useUpdateTagMutation,
} from "../store/slices/tagSlice";
import { Tag } from "../types/Tag";
import { EditableText } from "./EditableText";
import { TagColorDropdown } from "./TagColorDropdown";

interface Props {
  tag: Tag;
}

const TagCardContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: theme.spacing(1),
  border: "1px solid transparent",
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  "&:hover": {
    border: `1px solid ${theme.palette.divider}`,
    cursor: "pointer",
  },
}));

export const TagCard: FC<Props> = ({ tag }) => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [updateTag] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();
  const colorMap = useTagColors();
  const [isEditing, setIsEdting] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const onNameChange = (newTagName: string) => {
    if (!newTagName) {
      toast.error("Tag must have a name");
      return;
    }
    updateTag({
      ...tag,
      tagName: newTagName,
    });
  };

  const onColorChange = (event: SelectChangeEvent<string>) => {
    updateTag({
      ...tag,
      tagColor: event.target.value,
    });
  };

  useClickOutside(cardContainerRef, () => setIsEdting(false));

  return (
    <TagCardContainer
      onMouseEnter={() => setShowDeleteButton(true)}
      onMouseLeave={() => setShowDeleteButton(false)}
      onClick={() => setIsEdting(true)}
      ref={cardContainerRef}
    >
      <Label sx={{ color: colorMap.background[tag.tagColor] }} />
      <EditableText
        label="Tag Name"
        displayAs="p"
        initialValue={tag.tagName}
        onSave={onNameChange}
        isEditing={isEditing}
        onEditingStateChange={(isEditingChange) => {
          if (isEditingChange) {
            setShowDeleteButton(false);
            setIsEdting(true);
          }
        }}
      />
      {isEditing && (
        <TagColorDropdown value={tag.tagColor} onChange={onColorChange} />
      )}

      <IconButton
        sx={{
          visibility: showDeleteButton ? "visible" : "hidden",
          marginLeft: "auto",
        }}
        onClick={(e) => {
          e.stopPropagation();
          deleteTag({ id: tag.id.toString() });
        }}
      >
        <Delete />
      </IconButton>
    </TagCardContainer>
  );
};
