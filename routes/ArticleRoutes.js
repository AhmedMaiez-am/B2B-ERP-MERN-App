const express = require("express");
const axios = require("axios");
const router = express.Router();
const ntlm = require("express-ntlm");
//const Article = require("../models/Articles.js");

// Define auth function
const auth = ntlm({
  debug: console.log,
  domain: process.env.DOMAIN,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
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
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        workstation: process.env.WORKSTATION,
        domain: process.env.DOMAIN
      },
    };
    const companyId = "CRONUS France S.A.";
    const encodedCompanyId = encodeURIComponent(companyId);
    const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/ItemListec`;
    const response = await axios.get(url, options);
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
    console.error(error);
    res
      .status(500)
      .send("Error retrieving articles data from Business Central");
  }
});

module.exports = router;
