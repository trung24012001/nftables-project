import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { FC } from "react";
import { DefaultTheme } from "./theme";

const ThemeProvider: FC = ({ children }) => {
  return <MuiThemeProvider theme={DefaultTheme}>{children}</MuiThemeProvider>;
};

export default ThemeProvider;
