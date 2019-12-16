import React from "react";

//Make GQL requests to the server
import { GraphQLClient } from "graphql-request";
import { withStyles } from "@material-ui/core/styles";

//Google login button
import { GoogleLogin } from "react-google-login";
// import Typography from "@material-ui/core/Typography";

const Login = ({ classes }) => {
  const ME_QUERY = `{
    me {
      _id 
      name 
      email 
      picture
    }
  }`;

  //If user login is successful we will be returned a google user
  const onSuccess = async googleUser => {
    //Grab the token from the google user returned
    const idToken = googleUser.getAuthResponse().id_token;
    console.log({ idToken });

    //Instantiate a new GraphQL Client and pass the token as an authorization header
    const client = new GraphQLClient("http://localhost:4000/graphql", {
      headers: { authorization: idToken }
    });

    //Make a request with the Authorization header using the request method and passing it the GQL query
    const data = await client.request(ME_QUERY);
    console.log({ data });
  };
  return (
    <GoogleLogin
      clientId="85277232229-0u493v6di08hgfi9iv597l3s8qi1nc79.apps.googleusercontent.com"
      onSuccess={onSuccess}
      isSignedIn={true}
    />
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
