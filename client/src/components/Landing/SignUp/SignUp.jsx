import React, { useRef, useState } from "react";
import {
  TextField,
  InputAdornment,
  Button,
  makeStyles,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import Axios from "axios";
import { useHistory } from "react-router";
import { config } from "../../../firebase";
import firebase from "firebase";

import EmojiPeopleOutlinedIcon from "@material-ui/icons/EmojiPeopleOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import CallOutlinedIcon from "@material-ui/icons/CallOutlined";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import MailOutlineOutlinedIcon from "@material-ui/icons/MailOutlineOutlined";
import CheckIcon from "@material-ui/icons/Check";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";

const useStyles = makeStyles({
  input: {
    width: 300,
    marginBottom: "2rem",
    fontSize: "20px",
  },
  button: {
    width: 300,
  },
});

const app = firebase.initializeApp(config);

const SignUp = ({ setNotification }) => {
  const classes = useStyles();
  const history = useHistory();

  const email = useRef("");
  const phone = useRef("");
  const password = useRef("");
  const name = useRef("");

  const otp = useRef("");

  const [accountType, setAccountType] = useState("");
  const [otpValid, setOtpValid] = useState("");
  const [otpReply, setOtpRes] = useState();

  const handleChange = (event) => {
    setAccountType(event.target.value);
  };

  // const checkIfEmailIdExists = () => {
  //   if (accountType === "tracking") {
  //     Axios.get(
  //       "/api/trackingAccount/checkIfEmailIdExists?email=" + email.current.value
  //     )
  //       .then((res) => {
  //         emailExists.current.value = res.data;
  //       })
  //       .catch((err) => console.log(err));
  //   }
  //   if (accountType === "guardian") {
  //     Axios.get(
  //       "/api/guardianAccount/checkIfEmailIdExists?email=" + email.current.value
  //     )
  //       .then((res) => {
  //         emailExists.current.value = res.data;
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // };

  const sendOtp = () => {
    if (phone.current.value.length !== 10) {
      setNotification({ show: true, text: "Enter A Valid Phone Number" });
      return;
    }
    const number = "+91" + phone.current.value;
    const recaptcha = new firebase.auth.RecaptchaVerifier("recaptcha");

    app
      .auth()
      .signInWithPhoneNumber(number, recaptcha)
      .then((res) => {
        setOtpRes(res);
      })
      .catch((err) => console.log(err));
  };

  const checkIfValid = () => {
    if (otp.current.value)
      otpReply
        .confirm(otp.current.value)
        .then((res) => {
          setOtpValid(true);
        })
        .catch((err) =>
          setNotification({
            show: true,
            text: "Invalid Code",
          })
        );
  };

  const signUp = (e) => {
    e.preventDefault();
    if (phone.current.value.length !== 10) {
      setNotification({
        show: true,
        text: "Please enter a valid phone number",
      });
      return;
    }
    if (!otpValid) {
      setNotification({
        show: true,
        text: "Verify Phone Number First",
      });
      return;
    }

    const data = {
      email: email.current.value,
      phone: phone.current.value,
      password: password.current.value,
      name: name.current.value,
    };

    if (accountType === "tracking")
      Axios.post("/api/trackingAccount/signup", data)
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("wollof-auth", res.data.token);
            localStorage.setItem("wollof-accountType", "tracking");
            history.push("/tracking?page=dashboard");
          }
        })
        .catch((err) => console.log(err));
    if (accountType === "guardian")
      Axios.post("/api/guardianAccount/signup", data)
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("wollof-auth", res.data.token);
            localStorage.setItem("wollof-accountType", "guardian");
            history.push("/guardian?page=dashboard");
          }
        })
        .catch((err) => console.log(err));
  };

  return (
    <div className="login-container">
      <p className="signup-container-title">
        Hello,{" "}
        <span style={{ fontWeight: 800, color: "#061178" }}>New User</span>
      </p>
      <p className="signup-container-subtext">
        We are glad to have you on board
      </p>
      <FormControl className={classes.input}>
        <InputLabel>Type of Account</InputLabel>
        <Select
          onChange={handleChange}
          startAdornment={
            <InputAdornment>
              <PersonOutlineOutlinedIcon />
            </InputAdornment>
          }
        >
          <MenuItem value="tracking">Tracking</MenuItem>
          <MenuItem value="guardian">Guardian</MenuItem>
        </Select>
      </FormControl>
      <form action="" onSubmit={signUp}>
        <TextField
          type="email"
          color="primary"
          label="Email Address"
          className={classes.input}
          inputRef={email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineOutlinedIcon />
              </InputAdornment>
            ),
          }}
          required
        />
        <TextField
          type="text"
          color="primary"
          label="Phone Number"
          className={classes.input}
          inputRef={phone}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CallOutlinedIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="start">
                {!otpValid ? (
                  <Button onClick={sendOtp}> Verify </Button>
                ) : (
                  <CheckIcon
                    style={{
                      color: "green",
                    }}
                  />
                )}
              </InputAdornment>
            ),
          }}
          required
        />

        {otpReply && (
          <TextField
            type="text"
            color="primary"
            label="Enter OTP"
            className={classes.input}
            inputRef={otp}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneAndroidIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="start">
                  {!otpValid && (
                    <Button onClick={checkIfValid}> Submit </Button>
                  )}
                </InputAdornment>
              ),
            }}
            required
          />
        )}

        {!otpReply && <div id="recaptcha" />}

        <TextField
          type="text"
          color="primary"
          label="Your Name"
          className={classes.input}
          inputRef={name}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmojiPeopleOutlinedIcon />
              </InputAdornment>
            ),
          }}
          required
        />

        <TextField
          type="password"
          color="primary"
          label="Password"
          className={classes.input}
          inputRef={password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon />
              </InputAdornment>
            ),
          }}
          required
        />
        <br />
        <Button
          type="submit"
          className={classes.button}
          color="primary"
          variant="contained"
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
