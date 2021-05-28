import React, { useRef, useState } from "react";
import {
  Button,
  TextField,
  InputAdornment,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  DrawingManager,
  Polygon,
} from "@react-google-maps/api";
import Geocode from "react-geocode";
import Axios from "axios";

import "./Tracking.css";

import tracking from "../../../images/delivery.svg";
import markerIcon from "../../../images/marker.png";

import RoomOutlinedIcon from "@material-ui/icons/RoomOutlined";

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

const Tracking = ({ details }) => {
  const classes = useStyles();

  const [center, setCenter] = useState({
    lat: 19.0759899,
    lng: 72.8773928,
  });
  const [open, setOpen] = useState(false);

  const [process, setProcess] = useState("null");
  const [subprocess, setSubprocess] = useState("null");
  const [geofence, setGeofence] = useState([]);

  const mapRef = useRef(null);
  const mapInput = useRef(null);

  const password1 = useRef("");
  const password2 = useRef("");

  let marker = new window.google.maps.MarkerImage(
    markerIcon,
    null /* size is determined at runtime */,
    null /* origin is 0,0 */,
    null /* anchor is bottom center of the scaled image */,
    new window.google.maps.Size(45, 45)
  );

  const onMapLoad = (map) => (mapRef.current = map);

  const handleClose = () => setOpen(false);

  const searchLocation = () => {
    Geocode.setApiKey("AIzaSyBLAI47V3CRFb-lwrRRpHLcVhVfx5uFebA");
    Geocode.fromAddress(mapInput.current.value).then((response) => {
      const { lat, lng } = response.results[0].geometry.location;
      setCenter({ lat: lat, lng: lng });
    });
  };

  const onPolygonLoad = (polygon) => {
    setSubprocess("fenceMade");
    let polygonCoordsArray = [];
    const coords = polygon.getPath().getArray();
    for (let i = 0; i < coords.length; i++) {
      polygonCoordsArray.push({ lat: coords[i].lat(), lng: coords[i].lng() });
    }
    setGeofence(polygonCoordsArray);
    setSubprocess("fenceMade");
    Axios.put("/api/trackingAccount/currentGeoFence", {
      email: localStorage.getItem("wollof-auth"),
      geofence: polygonCoordsArray,
    });
  };

  const stopTracking = () => {
    Axios.put("/api/trackingAccount/stopTracking?email=" + details.email).then(
      () => {
        handleClose();
        setSubprocess("null");
        setProcess("null");
        setGeofence([]);
      }
    );
  };

  const checkIfInside = (e) => {
    const fence = new window.google.maps.Polygon({
      paths: geofence,
    });
    Axios.put("/api/trackingAccount/currentLocation", {
      email: localStorage.getItem("wollof-auth"),
      currentLocation: e.latLng,
    });

    const containsPlace = window.google.maps.geometry.poly.containsLocation(
      e.latLng,
      fence
    );
    if (containsPlace === false) {
      Axios.post("/api/messages", {
        to: "+918779460422",
        body: "I MISSS YOUUU AND UR CUTTEEE FACEEE",
      });
    }
  };

  const startTracking = () => {
    setProcess("tracking");
    Axios.put("/api/trackingAccount/currentLocation", {
      email: localStorage.getItem("wollof-auth"),
      currentLocation: center,
    });
  };

  return (
    <div className="tracking-dashboard-container">
      {process === "null" && (
        <>
          <img className="tracking-img" src={tracking} alt="tracking" />
          <br />
          <br />
          <Button
            onClick={() => setProcess("geofence")}
            color="primary"
            size="large"
            variant="outlined"
          >
            Set Up Fence
          </Button>
        </>
      )}

      <div style={{ width: "100vw" }}>
        {process === "geofence" && (
          <GoogleMap
            zoom={13}
            mapContainerStyle={{ height: "55vh", width: "100%" }}
            center={center}
            onLoad={onMapLoad}
            options={{ disableDefaultUI: true }}
          >
            {subprocess !== "fenceMade" && (
              <DrawingManager
                drawingMode="polygon"
                onPolygonComplete={onPolygonLoad}
                options={{ drawingControl: false }}
              />
            )}
            <Marker icon={marker} position={center} />
          </GoogleMap>
        )}
        {process === "tracking" && (
          <GoogleMap
            zoom={13}
            mapContainerStyle={{ height: "55vh", width: "100%" }}
            center={center}
            onLoad={onMapLoad}
            options={{ disableDefaultUI: true }}
          >
            <Polygon paths={geofence} options={options} />
            <Marker
              icon={marker}
              position={center}
              draggable={true}
              onDragEnd={checkIfInside}
            />
          </GoogleMap>
        )}
        <br />
        {process === "geofence" && (
          <>
            <StandaloneSearchBox onPlacesChanged={searchLocation}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search a location"
                inputRef={mapInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RoomOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </StandaloneSearchBox>
            <p className="tracking-helper-text">
              Search for a place and start drawing a fence
            </p>
            {subprocess === "fenceMade" && (
              <>
                {" "}
                <Button
                  className={classes.confirmButton}
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={startTracking}
                >
                  Confirm
                </Button>
                <br />
                <Button
                  className={classes.confirmButton}
                  size="small"
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    setProcess("null");
                    setSubprocess("null");
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </>
        )}
        {process === "tracking" && (
          <>
            <p className="being-tracked-text"> You Are Being Tracked </p>
            <Button
              className={classes.confirmButton}
              size="small"
              color="secondary"
              variant="contained"
              onClick={() => setOpen(true)}
            >
              Stop Tracking
            </Button>
          </>
        )}
      </div>
      <Dialog
        id="password-dialog"
        className={classes.dialog}
        onClose={handleClose}
        open={open}
      >
        <DialogTitle className={classes.title}>Enter password</DialogTitle>
        <DialogContent>
          <TextField
            size="small"
            variant="outlined"
            label="Confirm Password"
            className={classes.input}
            inputRef={password2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Back
          </Button>
          <Button variant="outlined" onClick={stopTracking} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Tracking;
