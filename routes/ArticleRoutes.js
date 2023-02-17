const express = require("express");
const router = express.Router();
const ntlm = require("express-ntlm");
const axios = require("axios");
//const Article = require("../models/Articles.js");

// Define auth function
const auth = ntlm({
  debug: console.log,
  Username: process.env.USERNAME,
  Password: process.env.PASSWORD,
  Domain: process.env.DOMAIN,
  ntlm_version: 2,
  reconnect: true,
  send_401: function (res) {
    res.sendStatus(401);
  },
  badrequest: function (res) {
    res.sendStatus(400);
  },
});

// Get article data from Business Central
async function getArticlesFromBC() {
  try {
    const options = {
      auth: {
        Username: process.env.USERNAME,
        Password: process.env.PASSWORD,
        Domain: process.env.DOMAIN,
        Workstation: process.env.WORKSTATION
      }
    };
    console.log(options);
    const companyId = "CRONUS France S.A.";
    const encodedCompanyId = encodeURIComponent(companyId);
    const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/ItemListec`;
    console.log("Requesting articles from:", url);
    const response = await axios.get(url, options);
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error retrieving articles data from Business Central");
  }
}


// Route to get article data
router.get("/", auth, async (req, res) => {
  try {
    const user = req.ntlm;
    console.log(user);
    let articles = await getArticlesFromBC();
    res.json(articles);
  } catch (error) {
    //console.error(error);
    res
      .status(500)
      .send("Error retrieving articles data from Business Central");
  }
});

module.exports = router;

