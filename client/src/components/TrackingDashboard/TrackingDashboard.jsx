import React from "react";
import {
  AppBar,
  Toolbar,
  makeStyles,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  Drawer,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { useHistory, useLocation } from "react-router";

import "./TrackingAccount.css";

import MenuIcon from "@material-ui/icons/Menu";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import Dashboard from "./Tracking/Tracking";
import Requests from "./Requests/Requests";

import tracking from "../../images/delivery.svg";

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
}));

const drawers = [
  {
    label: "Dashboard",
    icon: <MailIcon />,
    link: "/tracking?page=dashboard",
  },
  {
    label: "Requests",
    icon: <MailIcon />,
    link: "/tracking?page=requests",
  },
  {
    label: "Guardians",
    icon: <MailIcon />,
    link: "/tracking?page=guardians",
  },
  {
    label: "Logout",
    icon: <MailIcon />,
    link: "/",
  },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const TrackingDashboard = () => {
  const classes = useStyles();
  const history = useHistory();
  const page = useQuery().get("page");

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, left: open });
  };

  const list = (anchor) => (
    <div
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {drawers.map((item) => (
          <ListItem onClick={() => history.push(item.link)} button>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
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
      <Drawer anchor="left" open={state["left"]} onClose={toggleDrawer(false)}>
        {list("left")}
      </Drawer>
      {page === "dashboard" && <Dashboard />}
      {page === "requests" && <Requests />}
    </>
  );
};

export default TrackingDashboard;
