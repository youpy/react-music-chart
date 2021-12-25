import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import chart from "./2021.json";

ReactDOM.render(<App chart={chart.data} year={chart.year} />, document.getElementById("root"));
