import { Box, Button, useTheme } from "@mui/material";
import { HEADER_HEIGHT } from "../muiTheme";
import { useNavigate } from "react-router";

export const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        backgroundColor: theme.palette.mode === "light" ? "#DADADA" : "black",
        height: HEADER_HEIGHT,
        borderBottom: "1px solid #ccc",
      }}
      component="header"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
          width: "100%",
          margin: "0 auto",
          padding: "0 30px",
        }}
      >
        <img
          src={
            theme.palette.mode === "light" ? "logo-black.png" : "logo-no-bg.png"
          }
          alt="Logo"
          style={{ width: "60px", height: "auto" }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Log In
        </Button>
      </Box>
    </Box>
  );
};
