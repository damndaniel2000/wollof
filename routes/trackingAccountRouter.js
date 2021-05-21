const express = require("express");
const mongoose = require("mongoose");
const randomstring = require("randomstring");

const TrackingAccount = require("../models/TrackingAccount");
const GuardianAccount = require("../models/GuardianAccount");

const trackingRouter = express.Router();

trackingRouter.route("/signup").post((req, res, next) => {
  const data = req.body;
  data["uniqueId"] = randomstring.generate(5);
  data["trackingId"] = randomstring.generate(8);
  TrackingAccount.create(data)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => next(err));
});

trackingRouter.route("/login").post((req, res, next) => {
  TrackingAccount.findOne({ email: req.body.emailId })
    .then((data) => {
      if (data === null) {
        res.sendStatus(404);
        return;
      }
      if (data.password === req.body.password) res.sendStatus(200);
      else res.sendStatus(403);
    })
    .catch((err) => console.log(err));
});

trackingRouter.route("/getAccountDetails").get((req, res, next) => {
  TrackingAccount.findOne({ email: req.query.email })
    .then((data) => res.json(data))
    .catch((err) => next(err));
});

trackingRouter.route("/searchAccount").post((req, res, next) => {
  TrackingAccount.findOne({ uniqueId: req.body.uniqueId })
    .then((data) => res.json(data))
    .catch((err) => next(err));
});

trackingRouter.route("/getTrackingRequests").get((req, res, next) => {
  TrackingAccount.findOne({ email: req.query.email })
    .then((data) => res.json(data.trackingRequests))
    .catch((err) => next(err));
});

trackingRouter.route("/sendTrackingRequest").post((req, res, next) => {
  TrackingAccount.findOne({ uniqueId: req.body.uniqueId })
    .then((data) => {
      let arr = data.trackingRequests;
      arr.push(req.body.request);
      TrackingAccount.updateOne(
        { uniqueId: req.body.uniqueId },
        { $set: { trackingRequests: arr } }
      )
        .then((newData) => res.json({ msg: "Request Added Successfully" }))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

trackingRouter.route("/rejectTrackingRequest").post((req, res, next) => {
  TrackingAccount.findOne({ uniqueId: req.body.uniqueId })
    .then((data) => {
      const requests = data.trackingRequests;
      const removeRequest = requests.filter((item) => {
        if (item !== null) return item["email"] !== req.body.request.email;
      });

      TrackingAccount.updateOne(
        { uniqueId: req.body.uniqueId },
        { $set: { trackingRequests: removeRequest } }
      )
        .then((newData) => {
          res.json({
            msg: "Request Removed",
          });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

trackingRouter.route("/acceptTrackingRequest").post((req, res, next) => {
  let trackingList = [];
  GuardianAccount.findOne({ email: req.body.request.email })
    .then((data) => {
      trackingList = data.trackingList;
    })
    .catch((err) => next(err));
  TrackingAccount.findOne({ uniqueId: req.body.uniqueId })
    .then((data) => {
      const requests = data.trackingRequests;
      const list = data.guardianList;

      list.push(req.body.request);
      const filtereredArray = requests.filter((item) => {
        if (item !== null) return item["email"] !== req.body.request.email;
      });
      trackingList.push({
        email: data.email,
        trackingId: data.trackingId,
        name: data.name,
      });

      TrackingAccount.updateOne(
        { uniqueId: req.body.uniqueId },
        { $set: { trackingRequests: filtereredArray, guardianList: list } }
      )
        .then((newData) => {
          res.json({
            trackingRequests: data.trackingRequests,
            guardianList: data.guardianList,
          });
        })
        .catch((err) => next(err));
      GuardianAccount.updateOne(
        { email: req.body.request.email },
        { $set: { trackingList: trackingList } }
      )
        .then((updateData) => res.json(updateData))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

trackingRouter.route("/getGuardianList").get((req, res, next) => {
  TrackingAccount.findOne({ email: req.query.email })
    .then((data) => res.json(data.guardianList))
    .catch((err) => next(err));
});

trackingRouter
  .route("/currentLocation")
  .get((req, res, next) => {
    TrackingAccount.findOne({ trackingId: req.query.trackingId })
      .then((data) => res.json({ coords: data.currentLocation }))
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    TrackingAccount.updateOne(
      { email: req.body.email },
      { $set: { currentLocation: req.body.currentLocation } }
    )
      .then((data) => res.json(data))
      .catch((err) => next(err));
  });

trackingRouter
  .route("/currentGeoFence")
  .get((req, res, next) => {
    TrackingAccount.findOne({ trackingId: req.query.trackingId })
      .then((data) => res.json({ geofence: data.currentGeoFence }))
      .catch((err) => next(err));
  })
  .put((req, res, next) =>
    TrackingAccount.updateOne(
      { email: req.body.email },
      { $set: { currentGeoFence: req.body.geofence } }
    )
      .then((data) => res.json(data))
      .catch((err) => next(err))
  );

module.exports = trackingRouter;
