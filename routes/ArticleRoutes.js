const express = require("express");
const router = express.Router();
const httpntlm = require("httpntlm");

// Get article data from Business Central
async function getArticlesFromBC() {
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const domain = process.env.DOMAIN;
  const workstation = process.env.WORKSTATION;
  const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
  const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/ItemListec`;

  const options = {
    url: url,
    username: username,
    password: password,
    workstation: workstation,
    domain: domain
  };

  return new Promise((resolve, reject) => {
    httpntlm.get(options, (err, res) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(res.body);
      }
    });
  });
}

// Route to get article data
router.get("/", async (req, res) => {
  try {
    const articles = await getArticlesFromBC();
    res.json(articles);
  } catch (error) {
    console.error("Error retrieving articles data from Business Central:", error.message);
    res.status(500).send("Error retrieving articles data from Business Central");
  }
});

module.exports = router;
