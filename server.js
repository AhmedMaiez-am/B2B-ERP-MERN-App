const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const articleRouter = require("./routes/ArticleRoutes");
const usersRouter = require("./routes/users");
const auth = require("./routes/auth");
const enteteRouter = require("./routes/EnteteVenteRoutes");
const commandeRouter = require("./routes/Commande");
const factureRouter = require("./routes/Factures");
const avoirRouter = require("./routes/AvoirRoutes");
const clientRouter = require ("./routes/ClientsRoutes");
const userRequestRouter = require (".//routes/UserRequest");
const StripeRouter = require("./routes/Stripe");
const StockCheckRouter = require("./routes/StockCheck");

app.use(cors());
app.use(express.json());

// get driver connection
const path = require("path");

app.use(
  cors({
    origin: "http://localhost:3006", 
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
app.use("/facture", factureRouter);
app.use("/avoir", avoirRouter);
app.use("/clients", clientRouter);
app.use("/userReq", userRequestRouter);
app.use("/api/stripe", StripeRouter);
app.use("/stocks", StockCheckRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// Start server
const server = http.createServer(app);


server.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`Server is Running on PORT ${PORT}`);
});
