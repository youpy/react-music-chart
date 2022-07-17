import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import chart from "./chart.json";
import { aggregate } from "./utils";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App chart={aggregate(chart.data)} title={chart.title} />,
  </React.StrictMode>
);
