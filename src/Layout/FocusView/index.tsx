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

interface FocusViewProps {
  onLogoutSuccess: () => void;
}

export const FocusView = ({ onLogoutSuccess }: FocusViewProps) => {
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
      return <SettingsFocusView onLogoutSuccess={onLogoutSuccess} />;
    case "standup":
      return <StandupFocusView />;
    default:
      return <h1>{capitalize(focusView)}</h1>;
  }
};
