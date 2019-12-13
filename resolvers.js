const user = {
  _id: "1",
  name: "Dolwin",
  email: "dolwinf@gmail.com",
  pic: "CloudinaryURL"
};

module.exports = {
  Query: {
    me: () => user
  }
};
