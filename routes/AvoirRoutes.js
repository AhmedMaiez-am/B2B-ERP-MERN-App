const express = require("express");
const router = express.Router();
const httpntlm = require("httpntlm");

// Function to handle errors consistently
function handleError(res, errorMessage) {
  console.error(errorMessage);
  res.status(500).send(errorMessage);
}

// Get entete-avoir from BC
async function getAvoirFromBC() {
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const domain = process.env.DOMAIN;
  const workstation = process.env.WORKSTATION;
  const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
  const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/enteteAvoir`;

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
        handleError(reject, err);
      } else {
        resolve(res.body);
      }
    });
  });
}

// Add the articles data to MongoDB schema
router.post("/create", async (req, res) => {
  try {
    const avoirString = await getAvoirFromBC();
    const parsedJson = JSON.parse(avoirString);
    const entetes = parsedJson.value;
    const highestNo = Math.max(...entetes.map((entete) => entete.No));
    const newNo = highestNo + 1;
    const user = req.body.User;
    const reasonCode = req.body.Reason_Code;

    // Create the new "enteteAvoir" object
    const newEnteteAvoir = {
      No: newNo.toString(),
      Document_Type: "Credit Memo",
      Reason_Code: reasonCode,
      Sell_to_Customer_No: user.no,
      Sell_to_Customer_Name: user.name,
    };

    // Encode the company ID for the URL
    const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
    const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/enteteAvoir`;

    const options = {
      url: url,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      workstation: process.env.WORKSTATION,
      domain: process.env.DOMAIN,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      json: true,
      body: JSON.stringify(newEnteteAvoir),
    };

    // Send the new "enteteAvoir" data to Business Central
    const response = await new Promise((resolve, reject) => {
      httpntlm.post(options, (err, res) => {
        if (err) {
          handleError(reject, err);
        } else {
          resolve(res);
        }
      });
    });

    // Parse the response body and merge the new entete into it
    const responseBody = JSON.parse(response.body);
    if (!responseBody.value) {
      responseBody.value = [];
    }
    responseBody.value.push(newEnteteAvoir);

    // Send the modified JSON data back to the URL
    const modifiedOptions = {
      url: url,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      workstation: process.env.WORKSTATION,
      domain: process.env.DOMAIN,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      json: true,
      body: JSON.stringify(responseBody),
    };

    await new Promise((resolve, reject) => {
      httpntlm.put(modifiedOptions, (err, res) => {
        if (err) {
          handleError(reject, err);
        } else {
          resolve(res);
        }
      });
    });

    // Get the articles from the request body
    const articles = req.body.RetourArticle;

      const ligne = {
        Type: "Item",
        Document_Type: "Credit Memo",
        Document_No: newNo.toString(),
        Line_No: articles.Line_No,
        No: articles.No,
        Description: articles.Description,
        Unit_Price: articles.Unit_Price,
        Quantity: articles.Quantity,
      };
      const encodedCompanyId1 = encodeURIComponent("CRONUS France S.A.");
      const urlLigne = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId1}')/lignesAvoir`;
      const optionsLigne = {
        url: urlLigne,
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        workstation: process.env.WORKSTATION,
        domain: process.env.DOMAIN,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        json: true,
        body: JSON.stringify(ligne),
      };
      try {
        const responseLigne = await new Promise((resolve, reject) => {
          httpntlm.post(optionsLigne, (err, res) => {
            if (err) reject(err);
            else resolve(res);
          });
        });
        // Check the response for any errors
        if (responseLigne.statusCode !== 201) {
          console.error(
            "Error creating ligne in Business Central:",
            responseLigne.statusCode,
            responseLigne.statusMessage
          );
          res.status(500).send("Error creating ligne in Business Central");
          return;
        }
      } catch (error) {
        console.error("Error sending ligne data to Business Central:", error);
        res.status(500).send("Error sending ligne data to Business Central");
        return;
      }
    
    res.send(`New Entete with No ${newNo} and Lignes added successfully`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error occurred");
  }
});

module.exports = router;
