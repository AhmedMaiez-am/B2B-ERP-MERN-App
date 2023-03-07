const express = require("express");
const router = express.Router();
const httpntlm = require("httpntlm");
const Article = require("../models/Articles");

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
    domain: domain,
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
    const articlesString = await getArticlesFromBC();
    const articles = JSON.parse(articlesString);
    res.json(articles);
  } catch (error) {
    console.error(
      "Error retrieving articles data from Business Central:",
      error.message
    );
    res
      .status(500)
      .send("Error retrieving articles data from Business Central");
  }
});

// Route to get article data from MongoDB
router.get("/get", async (req, res) => {
  Article.find( function(err, article) {
    res.json(article);
  });
});



//add the articles data to mongodb schema
router.get("/insert", async (req, res) => {
  try {
    const articlesString = await getArticlesFromBC();
    const parsedJson = JSON.parse(articlesString);
    const articles = parsedJson.value; // Extract the array of articles from the 'value' property
    const articleDocs = articles.map((article) => {
      const isAvailable = article.Stocks > 0 ? "Disponible" : "Epuisé";
      return {
        num: article.NO,
        description: article.Description,
        stocks: article.Stocks,
        numGamme: article.N_x00B0__gamme,
        prixUni: article.Prix_Unitaire,
        numFrounisseur: article.N_x00B0__Fournisseur,
        isAvailable: isAvailable
      };
    });

    // Loop through each article document and update or insert it into the MongoDB collection
    articleDocs.forEach(async (articleDoc) => {
      await Article.updateOne(
        { num: articleDoc.num }, // Filter criteria to find existing document
        { $set: articleDoc }, // Update the existing document or insert a new one
        { upsert: true } // Use upsert option to insert if document doesn't exist
      );
    });

    res.send("Articles inserted successfully");
  } catch (error) {
    console.error(
      "Error retrieving articles data from Business Central:",
      error.message
    );
    res
      .status(500)
      .send("Error retrieving articles data from Business Central");
  }
});


module.exports = router;
