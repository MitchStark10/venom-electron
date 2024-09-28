import { Autocomplete, Chip, TextField } from "@mui/material";
import { FC, useMemo } from "react";
import { TagColorMap, useTagColors } from "../hooks/useTagColors";
import { useTagsQuery } from "../store/slices/tagSlice";
import { Tag } from "../types/Tag";

interface Props {
  value: Tag[];
  onChange: (newValue: Tag[]) => void;
}

const mapTagsToOptions = (tags: Tag[] | undefined, colorMap: TagColorMap) =>
  tags?.map((tag) => ({
    id: tag.id,
    label: tag.tagName,
    color: colorMap.text[tag.tagColor],
    backgroundColor: colorMap.background[tag.tagColor],
  })) ?? [];

export const TagDropdown: FC<Props> = ({ value, onChange }) => {
  const { data: tags } = useTagsQuery();
  const colorMap = useTagColors();

  const options = useMemo(
    () => mapTagsToOptions(tags, colorMap),
    [tags, colorMap]
  );
  const autocompleteValue = useMemo(
    () => mapTagsToOptions(value, colorMap),
    [value, colorMap]
  );

  return (
    <Autocomplete
      value={autocompleteValue}
      options={options}
      onChange={(_, newValue) => {
        const newValueIds = newValue.map((option) => option.id);
        const selectedTags = tags?.filter((tag) =>
          newValueIds.includes(tag.id)
        );
        onChange(selectedTags ?? []);
      }}
      multiple
      renderInput={(params) => <TextField {...params} label="Tags" />}
      slotProps={{
        popper: {
          disablePortal: true,
        },
      }}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={option.label}
            {...getTagProps({ index })}
            sx={{
              fontWeight: "bold",
              backgroundColor: option.backgroundColor,
              color: option.color,
            }}
          />
        ))
      }
    />
  );
};
