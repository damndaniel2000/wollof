import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import { LoadScript } from "@react-google-maps/api";
import Axios from "axios";

import Landing from "./components/Landing/Landing";
import TrackingDashboard from "./components/TrackingDashboard/TrackingDashboard";
import GuardianDashboard from "./components/GuardianDashboard/GuardianDashboard";

import "./App.css";
import theme from "./theme";

function App() {
  Axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = localStorage.getItem("wollof-auth");
      return config;
    },
    (err) => console.log(err)
  );

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBLAI47V3CRFb-lwrRRpHLcVhVfx5uFebA"
      libraries={["places", "drawing"]}
    >
      <Router>
        <ThemeProvider theme={theme}>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/tracking" component={TrackingDashboard} />
            <Route exact path="/guardian" component={GuardianDashboard} />
          </Switch>
        </ThemeProvider>
      </Router>
    </LoadScript>
  );
}

export default App;
