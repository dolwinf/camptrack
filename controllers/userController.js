const User = require("../models/User");
//library for server side verification
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async token => {
  //verify Auth token
  const googleUser = await verifyAuthToken(token);

  //check if user exists
  const user = await checkIfUserExists(googleUser.email);

  //if exists return else create a new record in the database
  return user ? user : createNewUser(googleUser);
};

const verifyAuthToken = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID
    });

    //return Google user
    return ticket.getPayload();
  } catch (err) {
    console.err(`Unable to verify Auth Token ${err}`);
  }
};

const checkIfUserExists = async email => await User.findOne({ email }).exec();

const createNewUser = googleUser => {
  const { name, email, picture } = googleUser;

  const user = { name, email, picture };

  return new User(user).save();
};
