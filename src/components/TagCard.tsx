import { Label } from "@mui/icons-material";
import { styled } from "@mui/system";
import { FC } from "react";
import { useTagColors } from "../hooks/useTagColors";
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
}));

export const TagCard: FC<Props> = ({ tag }) => {
  const colorMap = useTagColors();
  return (
    <TagCardContainer>
      <Label sx={{ color: colorMap[tag.tagColor] }} />
      <EditableText
        label="Tag Name"
        displayAs="p"
        initialValue={tag.tagName}
        onSave={() => {}}
      />
    </TagCardContainer>
  );
};
