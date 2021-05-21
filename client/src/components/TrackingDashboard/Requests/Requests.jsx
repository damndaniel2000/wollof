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

const Requests = ({ details }) => {
  const [requests, setRequests] = React.useState([]);

  React.useEffect(() => {
    Axios.get(
      "/api/trackingAccount/getTrackingRequests?email=" +
        localStorage.getItem("wollof-auth")
    )
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

  const rejectRequest = () => {
    Axios.post("/api/trackingAccount/rejectTrackingRequest", {
      email: localStorage.getItem("wollof-auth"),
    })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {requests.length !== 0 &&
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
        ))}
    </div>
  );
};

export default Requests;
