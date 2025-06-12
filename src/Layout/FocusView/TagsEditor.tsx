import { Button, CircularProgress, useTheme } from "@mui/material";
import { useState } from "react";
import { TagCard } from "../../components/TagCard";
import { Title } from "../../components/Title";
import { NewTagForm } from "../../components/forms/NewTagForm";
import {
  useReorderTagsMutation,
  useTagsQuery,
} from "../../store/slices/tagSlice";

export const TagsEditor = () => {
  const theme = useTheme();
  const { data: tags, isLoading } = useTagsQuery();
  const [showNewTagUI, setShowNewTagUI] = useState(false);
  const [reorderTags] = useReorderTagsMutation();

  if (isLoading) {
    return <CircularProgress />;
  }

  const onReorder = (prevPos: number, newPos: number) => {
    const tagsCopy = [...tags!];
    const [removed] = tagsCopy.splice(prevPos, 1);
    tagsCopy.splice(newPos, 0, removed);
    const reorderedTags = tagsCopy.map((tag, index) => ({
      ...tag,
      order: index,
    }));
    reorderTags(reorderedTags);
  };

  return (
    <div>
      <Title>Tags</Title>
      {tags?.map((tag) => (
        <TagCard tag={tag} key={tag.id} />
      ))}

      {showNewTagUI ? (
        <NewTagForm onSubmit={() => setShowNewTagUI(false)} />
      ) : (
        <Button
          variant="contained"
          sx={{ marginTop: theme.spacing(1) }}
          onClick={() => setShowNewTagUI(true)}
        >
          Add New Tag
        </Button>
      )}
    </div>
  );
};
