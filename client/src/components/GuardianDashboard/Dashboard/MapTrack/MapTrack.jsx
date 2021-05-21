import React from "react";
import Axios from "axios";

const MapTrack = (props) => {
  React.useEffect(() => {
    Axios.get(
      "/api/trackingAccount/currentLocation?trackingId=" + props.trackingId
    )
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
    Axios.get(
      "/api/TrackingAccount/currentGeoFence?trackingId=" + props.trackingId
    )
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }, []);
  return <h1> {props.trackingId} </h1>;
};

export default MapTrack;
