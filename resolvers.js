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
    me: authenticated((root, args, ctx) => ctx.currentUser),
    getPins: async (root, args, ctx) => {
      const pins = await Pin.find({})
        .populate("author")
        .populate("comments.author");
      return pins;
    }
  },

  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser._id
      }).save();
      const pinAdded = await Pin.populate(newPin, "author");
      return pinAdded;
    }),
    deletePin: authenticated(async (root, args, ctx) => {
      const pinDeleted = await Pin.findOneAndDelete({ _id: args.pinID }).exec();
      return pinDeleted;
    }),
    createComment: authenticated(async (root, args, ctx) => {
      const newComment = { text: args.text, author: ctx.currentUser._id };
      const pinUpdated = Pin.findOneAndUpdate(
        { _id: args.pinID },
        { $push: { comments: newComment } },
        { new: true }
      )
        .populate("author")
        .populate("comments.author");
      return pinUpdated;
    })
  }
};
