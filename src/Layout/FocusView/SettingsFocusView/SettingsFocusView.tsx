import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { DividerWithPadding } from "../../../components/DividerWithPadding";
import { Title } from "../../../components/Title";
import { deleteAuthToken } from "../../../lib/authToken";
import { useListsQuery } from "../../../store/slices/listSlice";
import { setIsModalOpen, setModalView } from "../../../store/slices/modalSlice";
import {
  useSettingsQuery,
  useUpdateSettingsMutation,
} from "../../../store/slices/userSlice";
import { AutoDeleteOptions } from "../../../types/Settings";

interface AutocompleteOption {
  label: string;
  value: number;
}

export const SettingsFocusView = () => {
  const { data: settingsData, isLoading } = useSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();
  const theme = useTheme();
  const [autoDeleteTasksSelection, setAutoDeleteTasksSelection] =
    useState("-1");
  const { data: lists } = useListsQuery();
  const [standupLists, setStandupLists] = useState<AutocompleteOption[]>(
    lists
      ?.filter((list) => list.isStandupList)
      .map((list) => ({
        label: list.listName,
        value: list.id,
      })) || []
  );
  const [dailyReportIgnoreWeekends, setDailyReportIgnoreWeekends] =
    useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    deleteAuthToken();
    window.location.reload();
  };

  const handleAutoDeleteTasksSelection = async (e: SelectChangeEvent) => {
    setAutoDeleteTasksSelection(e.target.value);
    const response = await updateSettings({
      autoDeleteTasks: e.target.value as AutoDeleteOptions,
      standupListIds: standupLists.map((list) => list.value),
      dailyReportIgnoreWeekends: settingsData?.dailyReportIgnoreWeekends,
    });

    if (!("error" in response)) {
      toast.success("Settings updated successfully");
    } else {
      toast.error("Failed to update settings");
    }
  };

  const handleChangeIgnoreWeekends = async () => {
    setDailyReportIgnoreWeekends(!dailyReportIgnoreWeekends);
    const response = await updateSettings({
      autoDeleteTasks: autoDeleteTasksSelection as AutoDeleteOptions,
      standupListIds: standupLists.map((list) => list.value),
      dailyReportIgnoreWeekends: !dailyReportIgnoreWeekends,
    });

    if (!("error" in response)) {
      toast.success("Settings updated successfully");
    } else {
      toast.error("Failed to update settings");
    }
  };

  const handleStandupListsSelection = async (
    _e: SyntheticEvent,
    newValue: AutocompleteOption[]
  ) => {
    setStandupLists(newValue);

    const standupListIds = newValue.map((list) => list.value);
    const response = await updateSettings({
      autoDeleteTasks: autoDeleteTasksSelection as AutoDeleteOptions,
      standupListIds,
    });

    if (!("error" in response)) {
      toast.success("Settings updated successfully");
    } else {
      toast.error("Failed to update settings");
    }
  };

  const listOptions: AutocompleteOption[] =
    lists?.map((list) => ({
      label: list.listName,
      value: list.id,
    })) || [];

  useEffect(() => {
    if (settingsData) {
      setAutoDeleteTasksSelection(settingsData.autoDeleteTasks);
      setDailyReportIgnoreWeekends(settingsData.dailyReportIgnoreWeekends);
    }
  }, [settingsData]);

  return (
    <div>
      <Title>Settings</Title>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ px: theme.spacing(1) }}>
          <Typography variant="h6">Daily Report</Typography>
          <DividerWithPadding />
          <Box
            sx={{
              py: theme.spacing(1),
              maxWidth: "500px",
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing(2),
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="auto-delete-tasks-label">
                Auto-Delete Tasks
              </InputLabel>
              <Select
                labelId="auto-delete-tasks-label"
                label="Auto-Delete Tasks"
                value={autoDeleteTasksSelection}
                onChange={handleAutoDeleteTasksSelection}
              >
                <MenuItem value={"-1"}>Never</MenuItem>
                <MenuItem value={"7"}>1 Week After Task Completion</MenuItem>
                <MenuItem value={"14"}>2 Weeks After Task Completion</MenuItem>
                <MenuItem value={"30"}>1 Month After Task Completion</MenuItem>
              </Select>
            </FormControl>
            <Autocomplete
              options={listOptions}
              renderInput={(params) => (
                <TextField {...params} label="Daily Report Lists" />
              )}
              multiple
              value={standupLists}
              onChange={handleStandupListsSelection}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={dailyReportIgnoreWeekends}
                  onChange={handleChangeIgnoreWeekends}
                />
              }
              label="Use work week calendar for daily report"
            />
          </Box>
          <DividerWithPadding />
          <Box
            sx={{
              display: "flex",
              gap: theme.spacing(2),
            }}
          >
            <Button variant="outlined" onClick={() => handleLogout()}>
              Logout
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                dispatch(setIsModalOpen(true));
                dispatch(setModalView("deleteAccount"));
              }}
            >
              Delete Account
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};
