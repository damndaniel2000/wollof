import React, { useState } from "react";
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
import Axios from "axios";

import MenuIcon from "@material-ui/icons/Menu";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import Search from "./Search/Search";
import Dashboard from "./Dashboard/Dashboard";

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
    link: "/guardian?page=dashboard",
  },
  {
    label: "Search",
    icon: <MailIcon />,
    link: "/guardian?page=search",
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

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    Axios.get(
      "/api/guardianAccount/getAccountDetails?email=" +
        localStorage.getItem("wollof-auth")
    )
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

  const list = (anchor) => (
    <div>
      <List>
        {drawers.map((item) => (
          <ListItem
            onClick={() => {
              setDrawerOpen(false);
              history.push(item.link);
            }}
            button
          >
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
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
      {page === "search" && <Search details={user} />}
      {page === "dashboard" && <Dashboard details={user} />}
    </>
  );
};

export default TrackingDashboard;
