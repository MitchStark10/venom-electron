import { Button, TextField } from "@mui/material";
import { VerticalAlignmentContainer } from "../../components/VerticalAlignmentContainer";
import { ModalTitle } from "./ModalTitle";

export const NewListModal = () => {
  return (
    <div>
      <ModalTitle>New List</ModalTitle>
      <VerticalAlignmentContainer>
        <TextField label="List Name" size="small" />
        <Button variant="contained">Create</Button>
      </VerticalAlignmentContainer>
    </div>
  );
};
