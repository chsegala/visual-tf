import { ThemeProvider } from "@emotion/react";
import { render } from "react-dom";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import { CssBaseline } from "@mui/material";
import theme from './theme';

render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
