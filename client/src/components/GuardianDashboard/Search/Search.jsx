import React from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core";
import Axios from "axios";

import Empty from "../../Empty/empty";

import "./Search.css";

import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles({});

const Search = ({ details, setNotification }) => {
  const classes = useStyles();
  const [searchResult, setSearchResult] = React.useState();

  const id = React.useRef(null);

  const searchForAccount = () => {
    Axios.post("/api/trackingAccount/searchAccount", {
      uniqueId: id.current.value,
    })
      .then((res) => setSearchResult(res.data))
      .catch((err) => console.log(err));
  };

  const sendRequest = (id) => {
    Axios.post("/api/trackingAccount/sendTrackingRequest", {
      uniqueId: id,
      request: {
        email: details.email,
        name: details.name,
        dateOfRequest: new Date(),
      },
    })
      .then((res) => {
        setNotification({
          show: true,
          severity: "success",
          text: "Request Sent",
        });
        setSearchResult(null);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="guardian-searchbar">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search a location"
          inputRef={id}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  onClick={searchForAccount}
                  size="small"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
      {searchResult && searchResult !== null && (
        <Card className={classes.root}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {searchResult.name}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {searchResult.email}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              onClick={() => sendRequest(searchResult.uniqueId)}
              size="small"
            >
              Send Request
            </Button>
          </CardActions>
        </Card>
      )}
      {searchResult === null && <Empty text="Nothing Found" />}
    </>
  );
};

export default Search;
