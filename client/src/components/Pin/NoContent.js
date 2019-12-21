import React from "react";
import { withStyles } from "@material-ui/core/styles";
import LocationSearchingIcon from "@material-ui/icons/LocationSearching";
import Typography from "@material-ui/core/Typography";
import PersonPinIcon from "@material-ui/icons/PersonPin";

const NoContent = ({ classes }) => (
  <div className={classes.root}>
    <PersonPinIcon className={classes.icon} />
    <Typography
      component="h2"
      variant="h6"
      align="center"
      color="textPrimary"
      gutterBottom
    >
      We all love camping. Tell us where you camped. Drag through the map and
      start pointing!
    </Typography>
  </div>
);

const styles = theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: "80px"
  }
});

export default withStyles(styles)(NoContent);
