import React from "react";
import { GoogleMap, Marker, Polygon } from "@react-google-maps/api";
import Axios from "axios";

const center = {
  lat: 3.5216453,
  lng: 101.7636108,
};

var outerCoords = [
  {
    lat: 3.528319665937775,
    lng: 101.7580347776062,
  },
  {
    lat: 3.003044444012029,
    lng: 101.4085838669952,
  },
  {
    lat: 2.9951223092598767,
    lng: 101.82611927913445,
  },
  {
    lat: 3.5216453,
    lng: 101.7636108,
  },
];

const options = {
  fillColor: "lightblue",
  fillOpacity: 1,
  strokeColor: "red",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1,
};

const MyMapComponent = (props) => {
  const checkGeofence = (e) => {
    var demoPolygon = new window.google.maps.Polygon({
      paths: outerCoords,
    });

    const containsPlace = window.google.maps.geometry.poly.containsLocation(
      e.latLng,
      demoPolygon
    );
    if (containsPlace === false) {
      Axios.post("/api/messages", {
        to: "+919930892362",
        body: "This is a demo text",
      });
    }
    console.log(containsPlace, "HEsRE");
  };

  return (
    <GoogleMap
      mapContainerStyle={{ height: "80vh", width: "50%" }}
      zoom={12}
      center={center}
    >
      <Polygon paths={outerCoords} options={options} />
      <Marker draggable={true} onDragEnd={checkGeofence} position={center} />
    </GoogleMap>
  );
};

export default MyMapComponent;
