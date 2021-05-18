import React, { useRef } from "react";
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

import EmojiPeopleOutlinedIcon from "@material-ui/icons/EmojiPeopleOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import CallOutlinedIcon from "@material-ui/icons/CallOutlined";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import MailOutlineOutlinedIcon from "@material-ui/icons/MailOutlineOutlined";

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

const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();

  const email = useRef("");
  const phone = useRef("");
  const password = useRef("");
  const name = useRef("");

  const [accountType, setAccountType] = React.useState("");

  const handleChange = (event) => {
    setAccountType(event.target.value);
  };

  const signUp = (e) => {
    e.preventDefault();
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
            localStorage.setItem("wollof-auth", email.current.value);
            history.push("/tracking?page=dashboard");
          }
        })
        .catch((err) => console.log(err));
    if (accountType === "guardian")
      Axios.post("/api/guardianAccount/signup", data)
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem("wollof-auth", email.current.value);
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
          }}
          required
        />
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
