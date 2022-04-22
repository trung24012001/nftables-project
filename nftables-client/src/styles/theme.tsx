import { createTheme } from "@mui/material";

export const DefaultTheme = createTheme({
  palette: {
    primary: {
      main: "#56BF97",
    },
    secondary: {
      main: "#fff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#fff",
        },
      },
    },
  },
});
