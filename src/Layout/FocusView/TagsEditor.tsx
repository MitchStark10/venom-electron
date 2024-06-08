import { Button, useTheme } from "@mui/material";
import { TagCard } from "../../components/TagCard";
import { Title } from "../../components/Title";
import { useTagsQuery } from "../../store/slices/tagSlice";

export const TagsEditor = () => {
  const theme = useTheme();
  const { data: tags } = useTagsQuery();
  return (
    <div>
      <Title>Tags</Title>
      {tags?.map((tag) => (
        <TagCard tag={tag} key={tag.id} />
      ))}
      <Button variant="contained" sx={{ marginTop: theme.spacing(1) }}>
        Add New Tag
      </Button>
    </div>
  );
};
