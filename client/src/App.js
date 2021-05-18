import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import { LoadScript } from "@react-google-maps/api";

import Map from "./components/Demo/Demo";
import Landing from "./components/Landing/Landing";
import TrackingDashboard from "./components/TrackingDashboard/TrackingDashboard";

import "./App.css";
import theme from "./theme";

function App() {
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBLAI47V3CRFb-lwrRRpHLcVhVfx5uFebA"
      libraries={["places", "drawing"]}
    >
      <Router>
        <ThemeProvider theme={theme}>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/demo" component={Map} />

            <Route exact path="/tracking" component={TrackingDashboard} />
          </Switch>
        </ThemeProvider>
      </Router>
    </LoadScript>
  );
}

export default App;
