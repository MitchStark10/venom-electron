import { Button, MenuItem, Select } from "@mui/material";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCreateTagMutation } from "../../store/slices/tagSlice";
import { Tag } from "../../types/Tag";
import { ControlledTextField } from "../ControlledTextField";
import { TagFormContainer } from "./NewTagForm.styles";

type FormData = Omit<Tag, "id" | "user">;

interface Props {
  onSubmit?: () => void;
}

export const NewTagForm: FC<Props> = ({ onSubmit }) => {
  const [createTag] = useCreateTagMutation();
  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: {
      tagName: "",
      tagColor: "blue",
    },
  });

  const submitNewTag = handleSubmit(async ({ tagColor, tagName }) => {
    if (!tagName || !tagColor) {
      toast.error("Tag name and color must be chosen");
      return;
    }

    await createTag({
      tagName,
      tagColor,
    });
    onSubmit?.();
  });

  return (
    <TagFormContainer>
      <ControlledTextField
        control={control}
        name="tagName"
        label="Tag Name"
        fullWidth
      />
      <Controller
        name="tagColor"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select value={value} onChange={onChange} fullWidth>
            <MenuItem value="blue">Blue</MenuItem>
            <MenuItem value="yellow">Yellow</MenuItem>
            <MenuItem value="red">Red</MenuItem>
            <MenuItem value="Green">Green</MenuItem>
          </Select>
        )}
      />
      <Button variant="contained" onClick={submitNewTag}>
        Submit
      </Button>
    </TagFormContainer>
  );
};
