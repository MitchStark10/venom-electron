import { Autocomplete, TextField } from "@mui/material";
import { FC, useMemo } from "react";
import { useTagsQuery } from "../store/slices/tagSlice";
import { Tag } from "../types/Tag";

interface Props {
  value: Tag[];
  onChange: (newValue: Tag[]) => void;
}

const mapTagsToOptions = (tags?: Tag[]) =>
  tags?.map((tag) => ({
    id: tag.id,
    label: tag.tagName,
  })) ?? [];

export const TagDropdown: FC<Props> = ({ value, onChange }) => {
  const { data: tags } = useTagsQuery();

  const options = useMemo(() => mapTagsToOptions(tags), [tags]);
  const autocompleteValue = useMemo(() => mapTagsToOptions(value), [value]);

  return (
    <Autocomplete
      sx={{
        width: "250px",
      }}
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
    />
  );
};
