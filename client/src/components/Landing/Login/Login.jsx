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

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import MailOutlineOutlinedIcon from "@material-ui/icons/MailOutlineOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";

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

const Login = ({ setNotification }) => {
  const classes = useStyles();
  const history = useHistory();

  const email = useRef("");
  const password = useRef("");

  const [accountType, setAccountType] = React.useState("");

  const handleChange = (event) => {
    setAccountType(event.target.value);
  };

  React.useEffect(() => {
    if (localStorage.getItem("wollof-auth") !== null)
      history.push(
        `/${localStorage.getItem("wollof-accountType")}?page=dashboard`
      );
  });

  const login = (e) => {
    e.preventDefault();
    const data = {
      emailId: email.current.value,
      password: password.current.value,
    };

    if (accountType === "tracking")
      Axios.post("/api/user/trackingLogin", data)
        .then((res) => {
          localStorage.setItem("wollof-auth", res.data.token);
          history.push("/tracking?page=dashboard");
        })
        .catch((err) => console.log(err));

    if (accountType === "guardian")
      Axios.post("/api/user/guardianLogin", data)
        .then((res) => {
          localStorage.setItem("wollof-auth", res.data.token);
          history.push("/guardian?page=dashboard");
        })
        .catch((err) =>
          setNotification({ show: true, text: err.response.data.msg })
        );
  };

  return (
    <div className="login-container">
      <p className="login-container-title">
        Welcome Back,{" "}
        <span style={{ fontWeight: 700, color: "#061178" }}>User</span>
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
      <form action="" onSubmit={login}>
        {" "}
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
        />
        <br />
        <Button
          type="submit"
          className={classes.button}
          color="primary"
          variant="contained"
        >
          Sign In
        </Button>
      </form>
      {/*<p className="login-container-forgot"> Forgot Your Password ? </p>*/}
    </div>
  );
};

export default Login;
