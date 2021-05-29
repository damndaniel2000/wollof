const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

const GuardianAccount = require("../models/GuardianAccount");

const guardianRouter = express.Router();

const returnObjectId = (auth) => {
  return jwt.verify(auth, process.env.JWT_SECRET).id;
};

guardianRouter.route("/signup").post(async (req, res, next) => {
  const data = req.body;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  data.password = hashedPassword;

  GuardianAccount.create(data)
    .then((response) => {
      const userData = response;
      const token = jwt.sign({ id: response._id }, process.env.JWT_SECRET);
      data.token = token;
      res.json(data);
    })
    .catch((err) => next(err));
});

guardianRouter.route("/checkIfEmailIdExists").get((req, res, next) => {
  GuardianAccount.findOne({ email: req.query.email })
    .then((data) => {
      if (data === null) res.json(false);
      else res.json(true);
    })
    .catch((err) => next(err));
});

guardianRouter.route("/getAccountDetails").get((req, res, next) => {
  GuardianAccount.findById(returnObjectId(req.header("Authorization")))
    .then((data) => res.json(data))
    .catch((err) => next(err));
});

guardianRouter.route("/getTrackingList").get(auth, (req, res, next) => {
  GuardianAccount.findById(returnObjectId(req.header("Authorization")))
    .then((data) => res.json(data.trackingList))
    .catch((err) => next(err));
});
module.exports = guardianRouter;
