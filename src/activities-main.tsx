import "./lib/webmcp/bootstrap";
import React from "react";
import ReactDOM from "react-dom/client";
import ActivitiesPage from "./ActivitiesPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ActivitiesPage pathname={window.location.pathname} />
  </React.StrictMode>,
);
