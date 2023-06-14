var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var articlesRouter = require("./routes/ArticleRoutes");
var config = require("./db/config.json");

var usersRouter = require("./routes/users");
var enteteRouter = require("./routes/EnteteVenteRoutes");
var commandeRouter = require("./routes/Commande");
var factureRouter = require("./routes/Factures");
var avoirRouter = require ("./routes/AvoirRoutes");
var clientRouter = require ("./routes/ClientsRoutes");
var userRequestRouter = require("./routes/UserRequest");
var StripeRouter = require("./routes/Stripe");

var app = express();
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);

//import database
var mongoose = require("mongoose");
//mongo config
const connect = mongoose.connect(
  config.mongo.uri,
  function (err, db) {
    if (err) {
      throw err;
    }
  }
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/users", usersRouter);
app.use("/articles", articlesRouter);
app.use("/enteteVentes", enteteRouter);
app.use("/commande", commandeRouter);
app.use("/facture", factureRouter);
app.use("/avoir", avoirRouter);
app.use("/clients", clientRouter);
app.use("/userReq", userRequestRouter);
app.use("/api/stripe", StripeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
