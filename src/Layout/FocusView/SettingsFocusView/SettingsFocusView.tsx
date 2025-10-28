import {
    ContentCopy,
    ExpandMore,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment,
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
import { deleteAuthToken, getAuthToken } from "../../../lib/authToken";
import { API_BASE_URL } from "../../../lib/constants";
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

  const [listsToShowCompletedTasks, setListsToShowCompletedTasks] = useState<
    AutocompleteOption[]
  >(
    lists
      ?.filter((list) => list.showCompletedTasks)
      .map((list) => ({
        label: list.listName,
        value: list.id,
      })) || []
  );

  const [dailyReportIgnoreWeekends, setDailyReportIgnoreWeekends] =
    useState(false);
  const dispatch = useDispatch();
  const [showToken, setShowToken] = useState(false);

  const handleLogout = () => {
    deleteAuthToken();
    window.location.reload();
  };

  const handleCopyToken = () => {
    const token = getAuthToken();
    if (token) {
      navigator.clipboard.writeText(token);
      toast.success("Token copied to clipboard");
    }
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

    const handlehowCompletedTasksSelection = async (
    _e: SyntheticEvent,
    newValue: AutocompleteOption[]
  ) => {
    setListsToShowCompletedTasks(newValue);

    const listsToShowCompletedTaskIds = newValue.map((list) => list.value);
    const response = await updateSettings({
      autoDeleteTasks: autoDeleteTasksSelection as AutoDeleteOptions,
      standupListIds: standupLists.map((list) => list.value),
      listsToShowCompletedTaskIds,
      dailyReportIgnoreWeekends: settingsData?.dailyReportIgnoreWeekends,
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
          <Typography variant="h6">General Settings</Typography>
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
                <TextField {...params} label="Show Completed Tasks" />
              )}
              multiple
              value={listsToShowCompletedTasks}
              onChange={handlehowCompletedTasksSelection}
            />
          </Box>

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
            <Autocomplete
              options={listOptions}
              renderInput={(params) => (
                <TextField {...params} label="Work Lists" />
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
              label="Factor weekends into calculations for daily report and daily recurring tasks (for work lists only)"
            />
          </Box>

          <Typography variant="h6">MCP Setup (BETA)</Typography>
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
            <TextField
              label="MCP Token"
              value={getAuthToken()}
              type={showToken ? "text" : "password"}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowToken(!showToken)}>
                      {showToken ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    <IconButton onClick={handleCopyToken}>
                      <ContentCopy />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="MCP URL"
              value={`${API_BASE_URL}/api/mcp`}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${API_BASE_URL}/api/mcp`
                        );
                        toast.success("URL copied to clipboard");
                      }}
                    >
                      <ContentCopy />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box
            sx={{
              py: theme.spacing(1),
              maxWidth: "500px",
            }}
          >
            <Accordion
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[900]
                    : theme.palette.grey[100],
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Gemini</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  component="pre"
                  sx={{
                    padding: theme.spacing(2),
                    borderRadius: "4px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    fontFamily: "monospace",
                    userSelect: "all",
                  }}
                >
                  <code>
                    {`"venomTasks": {
  "httpUrl": "https://venom-backend.onrender.com/api/mcp",
  "headers": {
    "Authorization": "Bearer ${getAuthToken()}"
  }
}`}
                  </code>
                </Box>
              </AccordionDetails>
            </Accordion>
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
