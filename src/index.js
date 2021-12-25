import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import chart from "./chart.json";

ReactDOM.render(<App chart={chart.data} title={chart.title} />, document.getElementById("root"));
