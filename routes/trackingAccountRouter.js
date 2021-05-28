const express = require("express");
const mongoose = require("mongoose");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

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

trackingRouter.route("/checkIfEmailIdExists").get((req, res, next) => {
  TrackingAccount.findOne({ email: req.query.email })
    .then((data) => {
      if (data === null) res.json(false);
      else res.json(true);
    })
    .catch((err) => next(err));
});

trackingRouter.route("/getAccountDetails").get((req, res, next) => {
  TrackingAccount.findById(returnObjectId(req.header("Authorization")))
    .then((data) => res.json(data))
    .catch((err) => next(err));
});

trackingRouter.route("/searchAccount").post((req, res, next) => {
  TrackingAccount.findOne({ uniqueId: req.body.uniqueId })
    .then((data) => res.json(data))
    .catch((err) => next(err));
});

trackingRouter.route("/getTrackingRequests").get(auth, (req, res, next) => {
  TrackingAccount.findById(returnObjectId(req.header("Authorization")))
    .then((data) => res.json(data.trackingRequests))
    .catch((err) => next(err));
});

trackingRouter.route("/sendTrackingRequest").post(auth, (req, res, next) => {
  TrackingAccount.findOne({ uniqueId: req.body.uniqueId })
    .then((data) => {
      let arr = data.trackingRequests;
      arr.push(req.body.request);
      var filtered = arr.reduce((filtered, item) => {
        if (!filtered.some((filteredItem) => filteredItem.email === item.email))
          filtered.push(item);
        return filtered;
      }, []);

      console.log(filtered);

      TrackingAccount.updateOne(
        { uniqueId: req.body.uniqueId },
        { $set: { trackingRequests: filtered } }
      )
        .then((newData) => res.json({ msg: "Request Added Successfully" }))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

trackingRouter.route("/rejectTrackingRequest").post(auth, (req, res, next) => {
  TrackingAccount.findOne({ uniqueId: req.body.uniqueId })
    .then((data) => {
      const requests = data.trackingRequests;
      const removeRequest = requests.filter((item) => {
        if (item !== null) return item["email"] !== req.body.email;
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

trackingRouter.route("/acceptTrackingRequest").post(auth, (req, res, next) => {
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

trackingRouter.route("/getGuardianList").get(auth, (req, res, next) => {
  TrackingAccount.findById(returnObjectId(req.header("Authorization")))
    .then((data) => {
      console.log(data);
      res.json(data.guardianList);
    })
    .catch((err) => next(err));
});

trackingRouter
  .route("/currentLocation")
  .get(auth, (req, res, next) => {
    TrackingAccount.findOne({ trackingId: req.query.trackingId })
      .then((data) => res.json({ coords: data.currentLocation }))
      .catch((err) => next(err));
  })
  .put(auth, (req, res, next) => {
    TrackingAccount.updateOne(
      { email: req.body.email },
      {
        $set: {
          currentLocation: req.body.currentLocation,
          currentlyTracking: true,
        },
      }
    )
      .then((data) => res.json(data))
      .catch((err) => next(err));
  });

trackingRouter
  .route("/currentGeoFence")
  .get(auth, (req, res, next) => {
    TrackingAccount.findOne({ trackingId: req.query.trackingId })
      .then((data) => res.json({ geofence: data.currentGeoFence }))
      .catch((err) => next(err));
  })
  .put(auth, (req, res, next) =>
    TrackingAccount.updateOne(
      { email: req.body.email },
      { $set: { currentGeoFence: req.body.geofence } }
    )
      .then((data) => res.json(data))
      .catch((err) => next(err))
  );

trackingRouter.route("/removeGuardian").post(auth, (req, res, next) => {
  TrackingAccount.findOne({ trackingId: req.body.trackingId })
    .then((trackerData) => {
      let guardians = trackerData.guardianList;
      const filteredGuardianList = guardians.filter(
        (item) => item.email !== req.body.email
      );
      TrackingAccount.updateOne(
        { trackingId: req.body.trackingId },
        { $set: { guardianList: filteredGuardianList } }
      )
        .then((updateInfo) => {
          GuardianAccount.findOne({ email: req.body.email }).then(
            (guardianData) => {
              const trackingList = guardianData.trackingList;
              const filteredTrackingList = trackingList.filter(
                (item) => item.trackingId !== req.body.trackingId
              );
              GuardianAccount.updateOne(
                { email: req.body.email },
                { $set: { trackingList: filteredTrackingList } }
              )
                .then((data) => res.json(data))
                .catch((err) => next(err));
            }
          );
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

trackingRouter.route("/stopTracking").put(auth, (req, res, next) => {
  TrackingAccount.updateOne(
    { email: req.query.email },
    {
      $set: {
        currentlyTracking: false,
        currentGeoFence: [],
        currentLocation: null,
      },
    }
  )
    .then((data) => res.json(data))
    .catch((err) => console.log(err));
});

module.exports = trackingRouter;
