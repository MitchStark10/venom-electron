import { TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../../components/Button";
import { VerticalAlignmentContainer } from "../../components/VerticalAlignmentContainer";
import { isResponseErrorType } from "../../lib/isResponseErrorType";
import {
  setFocusView,
  setSelectedListId,
} from "../../store/slices/focusViewSlice";
import { useCreateListMutation } from "../../store/slices/listSlice";
import { setIsModalOpen } from "../../store/slices/modalSlice";
import { ModalTitle } from "./ModalTitle";

export const NewListModal = () => {
  const [listName, setListName] = useState("");
  const [createList, { isLoading }] = useCreateListMutation();
  const dispatch = useDispatch();

  const handleCreateList = async () => {
    const response = await createList({ listName });

    if (isResponseErrorType(response)) {
      return;
    }

    dispatch(setIsModalOpen(false));
    dispatch(setFocusView("list"));
    dispatch(setSelectedListId(response.data.id));
  };

  return (
    <div>
      <ModalTitle>New List</ModalTitle>
      <VerticalAlignmentContainer>
        <TextField
          label="List Name"
          size="small"
          autoFocus
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              handleCreateList();
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleCreateList}
          disabled={isLoading}
        >
          Create
        </Button>
      </VerticalAlignmentContainer>
    </div>
  );
};
