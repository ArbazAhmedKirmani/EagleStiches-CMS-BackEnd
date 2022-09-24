require('dotenv').config()

module.exports = {
  logging: true,
  seed: false,
  db: {
    url: "mongodb://localhost:27017/cms",
  },
  port: process.env.PORT || 3002,
  secrets: {
    jwt: process.env.JWT || "gumball",
  },
  expireTime: 24 * 60 * 100,
};
