import React, { useContext } from "react";
import { GoogleLogout } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import Context from "../../context";

const Signout = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");
  const { dispatch } = useContext(Context);

  const onLogout = () => {
    dispatch({ type: "LOGOUT_USER" });
    console.log("Logged out user");
  };

  //Using render props provided by GoogleLogout to use a custom element which is span in this case and own Typography component from
  //material UI for the Login text on the button istead of using the buttonText prop
  return (
    <GoogleLogout
      onLogoutSuccess={onLogout}
      render={props => (
        <span className={classes.root} onClick={props.onClick}>
          <Typography
            style={{ display: mobileSize ? "none" : "block" }}
            variant="body1"
            className={classes.buttonText}
          >
            Logout
          </Typography>
          <ExitToAppIcon className={classes.buttonIcon} />
        </span>
      )}
    />
  );
};

const styles = {
  root: {
    cursor: "pointer",
    display: "flex"
  },
  buttonText: {
    color: "orange"
  },
  buttonIcon: {
    marginLeft: "5px",
    color: "orange"
  }
};

export default withStyles(styles)(Signout);
