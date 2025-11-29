// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb", // nice blue
    },
    background: {
      default: "#f3f4f6",
    },
  },
  shape: {
    borderRadius: 10,
  },
});

export default theme;
