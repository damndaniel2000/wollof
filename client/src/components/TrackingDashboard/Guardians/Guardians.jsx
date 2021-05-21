import React from "react";
import Axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@material-ui/core";

const Guardians = () => {
  const [guardians, setGuardians] = React.useState([]);

  React.useEffect(() => {
    Axios.get(
      "/api/trackingAccount/getGuardianList?email=" +
        localStorage.getItem("wollof-auth")
    )
      .then((res) => setGuardians(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {guardians.length !== 0 &&
        guardians.map((item) => (
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2">
                {item.name}
              </Typography>
              <Typography color="textSecondary">{item.email}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Remove</Button>
            </CardActions>
          </Card>
        ))}
    </div>
  );
};

export default Guardians;
