const express = require("express");
const mongoose = require("mongoose");

const GuardianAccount = require("../models/GuardianAccount");

const guardianRouter = express.Router();

guardianRouter.route("/signup").post((req, res, next) => {
  GuardianAccount.create(req.body)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => next(err));
});

guardianRouter.route("/login").post((req, res, next) => {
  GuardianAccount.findOne({ emailId: req.body.email })
    .then((data) => {
      if (data === null) {
        res.status(404);
        res.send({ msg: "Email Not Found" });
        return;
      }
      if (data.password === req.body.password) res.sendStatus(200);
      else res.sendStatus(403);
    })
    .catch((err) => console.log(err));
});

guardianRouter.route("/getAccountDetails").get((req, res, next) => {
  GuardianAccount.findOne({ email: req.query.email })
    .then((data) => res.json(data))
    .catch((err) => next(err));
});

guardianRouter.route("/getTrackingList").get((req, res, next) => {
  GuardianAccount.findOne({ email: req.query.email })
    .then((data) => res.json(data.trackingList))
    .catch((err) => next(err));
});
module.exports = guardianRouter;
