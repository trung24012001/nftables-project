import React from "react";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { Router } from "routers";
import { store } from "store";

function App() {
  return (
    <Provider store={store}>
      <CssBaseline />
      <Router />
    </Provider>
  );
}

export default App;
