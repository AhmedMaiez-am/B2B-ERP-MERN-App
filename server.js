const express = require("express");

// express app
const app = express();
const cors = require("cors");
var articleRouter = require("./routes/ArticleRoutes");
var usersRouter = require("./routes/users");
var auth = require("./routes/auth");
var enteteRouter = require ("./routes/EnteteVenteRoutes");
var commandeRouter = require ("./routes/Commande");

app.use(cors());
app.use(express.json());

// get driver connection
const path = require("path");

app.use(
  cors({
    origin: "*",
  })
);

require("dotenv").config();
// Import DATABASE CONNEXION
const connectDB = require("./db/conn.js");

connectDB();

app.use(express.static(path.join(__dirname, "frontend", "build")));
const PORT = process.env.PORT;

//middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});


//routes
app.use("/articles", articleRouter);
app.use("/users", usersRouter);
app.use("/auth", auth);
app.use("/enteteVentes", enteteRouter);
app.use("/commande", commandeRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// Start server
// PORT
app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`Server is Running on PORT ${PORT}`);
});
