import React from "react";
import Axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@material-ui/core";

import Empty from "../../Empty/empty";

const Guardians = ({ details }) => {
  const [guardians, setGuardians] = React.useState([]);

  React.useEffect(() => {
    if (details === null) return;
    Axios.get("/api/trackingAccount/getGuardianList")
      .then((res) => setGuardians(res.data))
      .catch((err) => console.log(err));
  }, []);

  const removeGuardian = (email) => {
    Axios.post("/api/trackingAccount/removeGuardian", {
      uniqueId: details.uniqueId,
      email: email,
    })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {guardians.length !== 0 ? (
        guardians.map((item) => (
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                {item.name}
              </Typography>
              <Typography color="textSecondary">{item.email}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => removeGuardian(item.email)}>
                Remove
              </Button>
            </CardActions>
          </Card>
        ))
      ) : (
        <Empty text="No One To Watch Over You" />
      )}
    </div>
  );
};

export default Guardians;
