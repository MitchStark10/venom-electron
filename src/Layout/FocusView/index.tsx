import { useSelector } from "react-redux";
import { capitalize } from "../../lib/capitalize";
import { RootState } from "../../store/store";
import { CompletedFocusView } from "./CompletedFocusView";
import { ListFocusView } from "./ListFocusView/ListFocusView";

export const FocusView = () => {
  const { focusView } = useSelector((state: RootState) => state.focusView);

  switch (focusView) {
    case "list":
      return <ListFocusView />;
    case "completed":
      return <CompletedFocusView />;
    default:
      return <h1>{capitalize(focusView)}</h1>;
  }
};
