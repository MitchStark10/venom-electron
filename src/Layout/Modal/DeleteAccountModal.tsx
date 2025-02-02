import { Box, Button, Typography, useTheme } from "@mui/material";
import { deleteAuthToken } from "../../lib/authToken";
import { useDeleteAccountMutation } from "../../store/slices/userSlice";
import { ModalTitle } from "./ModalTitle";

export const DeleteAccountModal = () => {
  const theme = useTheme();
  const [deleteAccount] = useDeleteAccountMutation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
        p: theme.spacing(2),
        color: theme.palette.mode === "dark" ? "white" : "black",
      }}
    >
      <ModalTitle>Delete Account</ModalTitle>
      <Typography>
        Are you sure you want to delete your account? This action cannot be
        undone.
      </Typography>
      <Button
        variant="outlined"
        color="error"
        onClick={async () => {
          await deleteAccount();
          deleteAuthToken();
          window.location.reload();
        }}
      >
        Delete Account
      </Button>
    </Box>
  );
};
