const { AuthenticationError } = require("apollo-server");

const user = {
  _id: "1",
  name: "Dolwin",
  email: "dolwinf@gmail.com",
  picture: "CloudinaryURL"
};

const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError("You need to be logged in");
  }
  //execute the resolver function
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser)
  }
};
