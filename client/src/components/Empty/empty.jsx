import React from "react";

import emptyBox from "../../images/box.svg";
import "./empty.css";

const Empty = ({ text }) => {
  return (
    <div className="empty-container">
      <img className="empty-image" src={emptyBox} alt="empty" />
      <p> {text} </p>
    </div>
  );
};

export default Empty;
