import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import chart from "./chart.json";
import { aggregate } from "./utils"

ReactDOM.render(
  <App chart={aggregate(chart.data)} title={chart.title} />,
  document.getElementById("root")
);
