import React, { useState } from "react";
import Axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@material-ui/core";

import MapTrack from "./MapTrack/MapTrack";

const Requests = ({ details }) => {
  const [tracking, setTracking] = useState([]);
  const [checkLocation, setIsCheckingLocation] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  React.useEffect(() => {
    Axios.get(
      "/api/guardianAccount/getTrackingList?email=" +
        localStorage.getItem("wollof-auth")
    )
      .then((res) => setTracking(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {!checkLocation && (
        <div>
          {tracking.length !== 0 &&
            tracking.map((item) => (
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {item.name}
                  </Typography>
                  <Typography color="textSecondary">{item.email}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => {
                      setTrackingId(item.trackingId);
                      setIsCheckingLocation(true);
                    }}
                  >
                    Track
                  </Button>
                  <Button size="small">Remove</Button>
                </CardActions>
              </Card>
            ))}
        </div>
      )}
      {checkLocation && <MapTrack trackingId={trackingId} />}
    </>
  );
};

export default Requests;
