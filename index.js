const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const http = require("http");
const MongoClient = require("mongoose");

require("dotenv").config();

const trackingRouter = require("./routes/trackingAccountRouter");
const guardianRouter = require("./routes/guardianAccountRouter");
const userRouter = require("./routes/userRouter");

const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_ID,
  process.env.TWILIO_AUTH_KEY
);

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(cors());

MongoClient.connect(process.env.MONGO_URI, {
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
      res.send({ success: false });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
