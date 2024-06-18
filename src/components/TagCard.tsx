import { Delete, Label } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { styled } from "@mui/system";
import { FC, useState } from "react";
import { toast } from "react-toastify";
import { useTagColors } from "../hooks/useTagColors";
import {
  useDeleteTagMutation,
  useUpdateTagMutation,
} from "../store/slices/tagSlice";
import { Tag } from "../types/Tag";
import { EditableText } from "./EditableText";

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
  },
}));

export const TagCard: FC<Props> = ({ tag }) => {
  const [updateTag] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();
  const colorMap = useTagColors();
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const onSave = (newTagName: string) => {
    if (!newTagName) {
      toast.error("Tag must have a name");
      return;
    }
    updateTag({
      ...tag,
      tagName: newTagName,
    });
  };

  return (
    <TagCardContainer
      onMouseEnter={() => setShowDeleteButton(true)}
      onMouseLeave={() => setShowDeleteButton(false)}
    >
      <Label sx={{ color: colorMap[tag.tagColor] }} />
      <EditableText
        label="Tag Name"
        displayAs="p"
        initialValue={tag.tagName}
        onSave={onSave}
        onEditingStateChange={(isEditing) => {
          if (isEditing) {
            setShowDeleteButton(false);
          }
        }}
      />

      <IconButton
        sx={{
          visibility: showDeleteButton ? "visible" : "hidden",
        }}
        onClick={() => deleteTag({ id: tag.id.toString() })}
      >
        <Delete />
      </IconButton>
    </TagCardContainer>
  );
};
