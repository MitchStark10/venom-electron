import { styled } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const FocusContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  padding: theme.spacing(16),
}));

export const FocusView = () => {
  const { focusView, selectedProjectId } = useSelector(
    (state: RootState) => state.focusView
  );
  return (
    <FocusContainer>
      <h1>
        {focusView} {selectedProjectId}
      </h1>
    </FocusContainer>
  );
};
