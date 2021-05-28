import React from "react";
import Axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@material-ui/core";

import "./Requests.css";

import Empty from "../../Empty/empty";

const Requests = ({ details }) => {
  const [requests, setRequests] = React.useState([]);

  React.useEffect(() => {
    if (details === null) return;
    Axios.get("/api/trackingAccount/getTrackingRequests")
      .then((res) => setRequests(res.data))
      .catch((err) => console.log(err));
  }, []);

  const acceptRequest = (item) => {
    Axios.post("/api/trackingAccount/acceptTrackingRequest", {
      request: { email: item.email, name: item.name },
      uniqueId: details.uniqueId,
    })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  const rejectRequest = (item) => {
    Axios.post("/api/trackingAccount/rejectTrackingRequest", {
      uniqueId: details.uniqueId,
      email: item.email,
    })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {requests.length !== 0 ? (
        requests.map((item) => (
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                {item.name}
              </Typography>
              <Typography color="textSecondary">{item.email}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => acceptRequest(item)}>
                Accept
              </Button>
              <Button size="small" onClick={() => rejectRequest(item)}>
                Decline
              </Button>
            </CardActions>
          </Card>
        ))
      ) : (
        <Empty text="No Requests Found" />
      )}
    </div>
  );
};

export default Requests;
