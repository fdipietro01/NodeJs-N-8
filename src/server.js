const express = require("express");
const router = require("./routes/index");
const handlebars = require("express-handlebars");

const initConection = require("./config/mongo");

const session = require("express-session");
const sessionConfig = require("./config/sessionConfig");

const passport = require("passport");
const initPassport = require("./middleware/passport");

const PORT = process.env.PORT;

//initialize app
const app = express();

//init mongoDB
initConection();

//set req&res formatters
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//set session
app.use(session(sessionConfig));

//set handlebars view&engine
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use("/aleas", express.static(__dirname + "/public"));

//passport
initPassport();
app.use(passport.initialize());
app.use(passport.session());

//set router
app.use(router);

app.listen(PORT, (err) => {
  if (err) return err;
  console.log(`Escuchando en el puerto ${PORT}`);
});
