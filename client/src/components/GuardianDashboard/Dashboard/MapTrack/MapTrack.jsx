import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";
import Axios from "axios";
import { GoogleMap, Marker, Polygon } from "@react-google-maps/api";

import markerIcon from "../../../../images/marker.png";

const options = {
  fillColor: "lightblue",
  fillOpacity: 0.5,
  strokeColor: "blue",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 0,
};

const useStyles = makeStyles((theme) => ({
  menuItem: {
    maxWidth: 200,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  navButtons: {
    width: 100,
  },
  confirmButton: {
    width: 200,
    marginBottom: 10,
  },
}));

const MapTrack = (props) => {
  const classes = useStyles();

  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentGeoFence, setCurrentGeofence] = useState(null);

  const mapRef = React.useRef(null);

  let marker = new window.google.maps.MarkerImage(
    markerIcon,
    null /* size is determined at runtime */,
    null /* origin is 0,0 */,
    null /* anchor is bottom center of the scaled image */,
    new window.google.maps.Size(45, 45)
  );

  const onMapLoad = (map) => (mapRef.current = map);

  React.useEffect(() => {
    Axios.get(
      "/api/trackingAccount/currentLocation?trackingId=" + props.trackingId
    )
      .then((res) =>
        setCurrentLocation({
          lat: parseFloat(res.data.coords.lat),
          lng: parseFloat(res.data.coords.lng),
        })
      )
      .catch((err) => console.log(err));
    Axios.get(
      "/api/TrackingAccount/currentGeoFence?trackingId=" + props.trackingId
    )
      .then((res) => {
        if (!res.data.data.currentlyTracking) {
          props.setNotification({
            show: true,
            severity: "error",
            text: "Friend Currently Not Being Tracked",
          });
          props.setIsCheckingLocation(false);
          return;
        }
        let geofenceData = [];
        res.data.geofence.forEach((item) => {
          geofenceData.push({
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lng),
          });
        });
        setCurrentGeofence(geofenceData);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <GoogleMap
        zoom={13}
        mapContainerStyle={{ height: "55vh", width: "100%" }}
        center={currentLocation}
        onLoad={onMapLoad}
        options={{ disableDefaultUI: true }}
      >
        <Polygon paths={currentGeoFence} options={options} />
        <Marker icon={marker} position={currentLocation} />
      </GoogleMap>
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <Button
          className={classes.confirmButton}
          size="small"
          color="secondary"
          variant="contained"
          onClick={() => props.setIsCheckingLocation(false)}
        >
          Back
        </Button>
      </div>
    </>
  );
};

export default MapTrack;
