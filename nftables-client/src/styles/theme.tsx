import { createTheme } from "@mui/material";

const primaryColor = "#56BF97"

export const DefaultTheme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
      light: "#56bf974d"
    },
    secondary: {
      main: "#fff",
    },
    action: {
      // hover: grey[100]
      hover: '#56bf971a'
    },
    success: {
      main: primaryColor
    }
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
