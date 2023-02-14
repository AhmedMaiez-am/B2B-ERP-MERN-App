const express = require("express");
const axios = require("axios");
const router = express.Router();
const Article = require("../models/Articles.js");


// Get customer data from Business Central
async function getArticlesFromBC(ntlm) {
  const companyId = 'CRONUS France S.A.';
  const encodedCompanyId = encodeURIComponent(companyId);
  const url = `http://desktop-1ef91e4:7048/BC210/ODataV4/Company('${encodedCompanyId}')/ItemListec`;
  const options = {
    auth: ntlm
  };
  const response = await axios.get(url, options);
  return response.data;
}

// Route to get article data
router.get("/", async (req, res) => {
  try {
    const ntlm = {
      username: 'ahmed',
      password: 'ahmed2022',
      workstation: 'DESKTOP-1EF91E4',
      domain: 'DESKTOP-1EF91E4'
    };
    const articles = await getArticlesFromBC(ntlm);
    res.json(articles);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Error retrieving articles data from Business Central");
  }
});

module.exports = router;
