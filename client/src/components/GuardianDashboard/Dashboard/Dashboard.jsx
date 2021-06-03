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
import Empty from "../../Empty/empty";

const Requests = ({ details, setNotification }) => {
  const [tracking, setTracking] = useState([]);
  const [checkLocation, setIsCheckingLocation] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  const [changeData, setChangeData] = useState(false);

  React.useEffect(() => {
    Axios.get("/api/guardianAccount/getTrackingList?")
      .then((res) => setTracking(res.data))
      .catch((err) => console.log(err));
  }, [changeData]);

  const removeTracking = (trackingId) => {
    Axios.post("/api/trackingAccount/removeGuardian", {
      trackingId: trackingId,
      email: details.email,
    })
      .then((res) => {
        setNotification({
          show: true,
          severity: "success",
          text: "Friend Removed",
        });
        setChangeData(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {!checkLocation && (
        <div>
          {tracking.length !== 0 ? (
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
                  <Button
                    size="small"
                    onClick={() => removeTracking(item.trackingId)}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            ))
          ) : (
            <Empty text="Add Friends To Track Them Here" />
          )}
        </div>
      )}
      {checkLocation && (
        <MapTrack
          trackingId={trackingId}
          setIsCheckingLocation={setIsCheckingLocation}
          setNotification={setNotification}
        />
      )}
    </>
  );
};

export default Requests;
