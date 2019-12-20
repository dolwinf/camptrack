import React, { useContext } from "react";
import Context from "../../context";

//Make GQL requests to the server
import { GraphQLClient } from "graphql-request";
import { withStyles } from "@material-ui/core/styles";

//Google login button on the browser to get out token ID
import { GoogleLogin } from "react-google-login";
import Typography from "@material-ui/core/Typography";

import { ME_QUERY } from "../../graphql/queries";

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  //If user login is successful we will be returned a google user
  const onSuccess = async googleUser => {
    //Grab the token from the google user returned
    const idToken = googleUser.getAuthResponse().id_token;
    // console.log({ idToken });

    //Instantiate a new GraphQL Client and pass the token as an authorization header.
    const client = new GraphQLClient("http://localhost:4000/graphql", {
      headers: { authorization: idToken }
    });

    //Make a request with the Authorization header using the request method and passing it the GQL query.
    //This request will be passed on and can be access in the context section of the Apollo server,
    //which we will then use to verify the idToken/header from the backend
    const data = await client.request(ME_QUERY);
    dispatch({ type: "LOGIN_USER", payload: data.me });
    dispatch({ type: "IS_LOGGED_IN", payload: googleUser.isSignedIn() });
  };

  const onFailure = err => {
    console.log(`Error logging in ${err}`);
  };
  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        paragraph
        noWrap
        style={{ color: "rgb(66,133,244)" }}
      >
        Let's camp
      </Typography>
      <GoogleLogin
        clientId="85277232229-0u493v6di08hgfi9iv597l3s8qi1nc79.apps.googleusercontent.com"
        onSuccess={onSuccess}
        isSignedIn={true}
        onFailure={onFailure}
        theme="dark"
        buttonText="Login with Google"
      />
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
