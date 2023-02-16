const express = require("express");
const axios = require("axios");
const router = express.Router();
const ntlm = require("express-ntlm");
//const Article = require("../models/Articles.js");

// Define auth function
const auth = ntlm({
  debug: function () {
    const args = Array.prototype.slice.apply(arguments);
    console.log.apply(null, args);
  },
  domain: "DESKTOP-1EF91E4",
  username: "ahmed",
  password: "ahmed2022",
});

// Get customer data from Business Central
async function getArticlesFromBC() {
  const companyId = "CRONUS France S.A.";
  const encodedCompanyId = encodeURIComponent(companyId);
  const url = `http://desktop-1ef91e4:7048/BC210/ODataV4/Company('${encodedCompanyId}')/ItemListec`;
  const response = await axios.get(url);
  return response.data;
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
