const express = require("express");
const mongoose = require("mongoose");

const GuardianAccount = require("../models/GuardianAccount");

const guardianRouter = express.Router();

guardianRouter.route("/signup").post((req, res, next) => {
  GuardianAccount.create(data)
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

guardianRouter.route("/requestAccepted").post((req, res, next) => {
  GuardianAccount.findOne({ email: req.body.emailId })
    .then((data) => {
      const arr = data.trackingList;
      arr.push(req.body.newTrackingAccount);
      GuardianAccount.updateOne(
        { email: req.body.emailId },
        { $set: { trackingList: arr } }
      )
        .then((data) => res.json(data.trackingList))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

module.exports = guardianRouter;
