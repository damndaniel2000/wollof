import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Axios from "axios";

Axios.interceptors.request.use(
  (config) => {
    config.url = "http://localhost:3000" + config.url;
    return config;
  },
  (err) => console.log(err)
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
