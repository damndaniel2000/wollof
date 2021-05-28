const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const http = require("http");
const MongoClient = require("mongoose");
const client = require("twilio")(
  "AC5e133192bca3d06c06d84be6d7fe600d",
  "1c72fecc73682aae4d82b8a640787998"
);
require("dotenv").config();

const trackingRouter = require("./routes/trackingAccountRouter");
const guardianRouter = require("./routes/guardianAccountRouter");
const userRouter = require("./routes/userRouter");

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(cors());

//mongodb+srv://WeTrack:taranicole@wetrackcluster.gboms.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

MongoClient.connect("mongodb://localhost:27017/wollof", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(() => console.log("Database connection successful"))
  .catch((err) => console.error("Error while connecting to database:", err));

app.use("/api/trackingAccount", trackingRouter);
app.use("/api/guardianAccount", guardianRouter);
app.use("/api/user", userRouter);

app.post("/api/messages", (req, res) => {
  res.header("Content-Type", "application/json");
  client.messages
    .create({
      from: "+13528779729",
      to: req.body.to,
      body: req.body.body,
    })
    .then((msg) => res.send({ success: msg }))
    .catch((err) => {
      console.log(err);
      res.send({ success: false });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
