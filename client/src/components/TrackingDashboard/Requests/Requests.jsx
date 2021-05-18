import React from "react";
import Axios from "axios";

import "./Requests.css";

const Requests = () => {
  const [requests, setRequests] = React.useState([]);

  React.useEffect(() => {
    Axios.get(
      "/api/trackingAccount/getTrackingRequests?email=" +
        localStorage.getItem("wollof-auth")
    )
      .then((res) => setRequests(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {" "}
      {requests.map((item) => (
        <h1> {item.name} </h1>
      ))}
    </div>
  );
};

export default Requests;
