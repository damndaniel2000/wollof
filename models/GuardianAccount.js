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
  },
  password: {
    type: String,
    required: true,
  },
  trackingList: [],
});

module.exports = TrackingAccount = mongoose.model(
  "GuardianAccount",
  trackingAccountSchema
);
