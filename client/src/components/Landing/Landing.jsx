import React from "react";
import {
  Snackbar,
  makeStyles,
  Tab,
  Tabs,
  Box,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import PropTypes from "prop-types";

import "./Landing.css";

import Login from "./Login/Login";
import Signup from "./SignUp/SignUp";

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Landing = () => {
  const classes = useStyles();

  const [notification, setNotification] = React.useState({
    show: false,
  });

  const handleNotificationClose = () => setNotification({ show: false });

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs
        style={{ marginLeft: "1rem" }}
        value={value}
        onChange={handleChange}
      >
        <Tab label="Login" {...a11yProps(0)} />
        <Tab label="Sign Up" {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Login setNotification={setNotification} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Signup setNotification={setNotification} />
      </TabPanel>

      <Snackbar
        open={notification.show}
        autoHideDuration={5000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity="error"
          variant="filled"
        >
          {notification.text}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Landing;
