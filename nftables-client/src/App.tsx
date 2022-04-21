import React from "react";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { Router } from "routers";
import { store } from "store";
import ThemeProvider from "styles/theme-provider";

function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <CssBaseline />
        <Router />
      </Provider>
    </ThemeProvider>
  );
}

export default App;
