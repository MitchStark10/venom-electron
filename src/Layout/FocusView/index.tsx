import { useSelector } from "react-redux";
import { capitalize } from "../../lib/capitalize";
import { RootState } from "../../store/store";
import { CompletedFocusView } from "./CompletedFocusView";
import { ListFocusView } from "./ListFocusView/ListFocusView";
import { SettingsFocusView } from "./SettingsFocusView/SettingsFocusView";
import { StandupFocusView } from "./StandupFocusView";
import { TagsEditor } from "./TagsEditor";
import { TodayFocusView } from "./TodayFocusView";
import { UpcomingFocusView } from "./UpcomingFocusView";

export const FocusView = () => {
  const { focusView } = useSelector((state: RootState) => state.focusView);

  switch (focusView) {
    case "list":
      return <ListFocusView />;
    case "completed":
      return <CompletedFocusView />;
    case "today":
      return <TodayFocusView />;
    case "upcoming":
      return <UpcomingFocusView />;
    case "tags":
      return <TagsEditor />;
    case "settings":
      return <SettingsFocusView />;
    case "standup":
      return <StandupFocusView />;
    default:
      return <h1>{capitalize(focusView)}</h1>;
  }
};
