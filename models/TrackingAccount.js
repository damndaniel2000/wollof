const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trackingAccountSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  uniqueId: {
    type: String,
    required: true,
  },
  trackingRequests: [
    {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      dateOfRequest: {
        type: String,
      },
    },
  ],
  guardianList: [
    {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      dateOfRequest: {
        type: String,
      },
    },
  ],
  trackingId: {
    type: String,
    required: true,
  },
  currentGeoFence: [
    {
      lat: {
        type: String,
      },
      lng: {
        type: String,
      },
    },
  ],
  currentlyTracking: {
    type: Boolean,
    default: false,
  },
  currentLocation: {
    lat: {
      type: String,
    },
    lng: {
      type: String,
    },
  },
});

module.exports = TrackingAccount = mongoose.model(
  "TrackingAccount",
  trackingAccountSchema
);
