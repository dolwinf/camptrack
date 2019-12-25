const { AuthenticationError } = require("apollo-server");
const Pin = require("./models/Pin");

//If no user, return error
const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError("You need to be logged in");
  }
  //execute the resolver function
  return next(root, args, ctx, info);
};

//Wrap the resolver in a higher order function and return the currently logged in user
module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser)
  },

  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser._id
      }).save();
      const pinAdded = await Pin.populate(newPin, "author");
      return pinAdded;
    })
  }
};
