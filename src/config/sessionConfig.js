const MongoStore = require("connect-mongo");

const url = process.env.MONGOECOMMERCE;

const sessionConfig = {
  secret: "Secret",
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: url,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    ttl: 15000000000,
  }),
};

module.exports = sessionConfig;
