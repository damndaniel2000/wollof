import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  makeStyles,
  Typography,
  IconButton,
  List,
  ListItem,
  Drawer,
  ListItemIcon,
  ListItemText,
  useTheme,
  Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useHistory, useLocation } from "react-router";
import Axios from "axios";

import "./TrackingAccount.css";

import DashboardIcon from "@material-ui/icons/Dashboard";
import NotificationsActiveOutlinedIcon from "@material-ui/icons/NotificationsActiveOutlined";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import BookmarksOutlinedIcon from "@material-ui/icons/BookmarksOutlined";
import MenuIcon from "@material-ui/icons/Menu";

import Dashboard from "./Tracking/Tracking";
import Requests from "./Requests/Requests";
import Guardians from "./Guardians/Guardians";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textTransform: "capitalize",
  },
  drawerWidth: {
    width: "60vw",
  },
  listItem: {
    fontFamily: "rajdhani",
    fontWeight: 600,
  },
  listItemActive: {
    color: theme.palette.common.blue,
  },
}));

const drawers = [
  {
    label: "Dashboard",
    icon: <DashboardIcon />,
    link: "/tracking?page=dashboard",
  },
  {
    label: "Requests",
    icon: <NotificationsActiveOutlinedIcon />,
    link: "/tracking?page=requests",
  },
  {
    label: "Guardians",
    icon: <PeopleAltIcon />,
    link: "/tracking?page=guardians",
  },
  {
    label: "Logout",
    icon: <ExitToAppOutlinedIcon />,
    link: "/",
  },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const TrackingDashboard = () => {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const page = useQuery().get("page");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [notification, setNotification] = useState({
    show: false,
  });

  const handleNotificationClose = () => setNotification({ show: false });

  React.useEffect(() => {
    if (user === null) history.push("/tracking?page=dashboard");
    Axios.get("/api/trackingAccount/getAccountDetails")
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  const copyUniqueId = () => {
    var copyText = document.getElementById("uniqueId");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    document.execCommand("copy");
  };

  if (document.getElementById("uniqueId") !== null)
    document.getElementById("uniqueId").readOnly = true;

  const list = () => (
    <div>
      {user !== null && (
        <div className="drawer-header">
          <h3> {user.name} </h3>
          <input type="text" value={user.uniqueId} id="uniqueId" />{" "}
          <IconButton size="small" onClick={copyUniqueId}>
            <BookmarksOutlinedIcon style={{ fill: "white", fontSize: 15 }} />
          </IconButton>
        </div>
      )}
      <List>
        {drawers.map((item) => (
          <ListItem
            onClick={() => {
              setDrawerOpen(false);
              history.push(item.link);
            }}
            selected={item.label.toLowerCase() === page}
            classes={{ selected: classes.listItemActive }}
            button
          >
            <ListItemIcon
              style={{
                color:
                  item.label.toLowerCase() === page &&
                  theme.palette.common.blue,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItem }}
              primary={item.label}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {page}
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        classes={{ paper: classes.drawerWidth }}
      >
        {list()}
      </Drawer>
      <Snackbar
        open={notification.show}
        autoHideDuration={5000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          variant="filled"
        >
          {notification.text}
        </Alert>
      </Snackbar>
      {page === "dashboard" && <Dashboard details={user} />}
      {page === "requests" && (
        <Requests details={user} setNotification={setNotification} />
      )}
      {page === "guardians" && (
        <Guardians details={user} setNotification={setNotification} />
      )}
    </>
  );
};

export default TrackingDashboard;
