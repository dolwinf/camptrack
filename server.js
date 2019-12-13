const { ApolloServer } = require("apollo-server");
require("dotenv").config();

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.log(err));

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(url);
});
