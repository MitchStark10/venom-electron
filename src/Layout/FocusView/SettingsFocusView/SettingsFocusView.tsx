import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { DividerWithPadding } from "../../../components/DividerWithPadding";
import { Title } from "../../../components/Title";
import { deleteAuthToken } from "../../../lib/authToken";
import { useListsQuery } from "../../../store/slices/listSlice";

interface AutocompleteOption {
  label: string;
  value: number;
}

export const SettingsFocusView = () => {
  const theme = useTheme();
  const [autoDeleteTasksSelection, setAutoDeleteTasksSelection] =
    useState("-1");
  const [standupLists, setStandupLists] = useState<AutocompleteOption[]>();
  const handleLogout = () => {
    deleteAuthToken();
    window.location.reload();
  };
  const { data: lists } = useListsQuery();

  const handleAutoDeleteTasksSelection = (e: SelectChangeEvent) => {
    setAutoDeleteTasksSelection(e.target.value);
    // TODO: Send the API call to send this selection
  };

  const handleStandupListsSelection = (
    _e: SyntheticEvent,
    newValue: AutocompleteOption[]
  ) => {
    setStandupLists(newValue);
  };

  const listOptions: AutocompleteOption[] =
    lists?.map((list) => ({
      label: list.listName,
      value: list.id,
    })) || [];

  return (
    <div>
      <Title>Settings</Title>
      <Box sx={{ px: theme.spacing(1) }}>
        <Typography variant="h6">Standup</Typography>
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
              <MenuItem value={"5"}>5 Days After Task Completion</MenuItem>
              <MenuItem value={"10"}>10 Days After Task Completion</MenuItem>
            </Select>
          </FormControl>
          <Autocomplete
            options={listOptions}
            renderInput={(params) => (
              <TextField {...params} label="Standup Lists" />
            )}
            multiple
            value={standupLists}
            onChange={handleStandupListsSelection}
          />
        </Box>
        <DividerWithPadding />
        <Button variant="outlined" onClick={() => handleLogout()}>
          Logout
        </Button>
      </Box>
    </div>
  );
};
