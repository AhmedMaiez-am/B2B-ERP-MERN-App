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
    const articles = req.body.RetourArticles;

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];

      const lignes = {
        Type: "Item",
        Document_Type: "Credit Memo",
        Document_No: newNo.toString(),
        Line_No: article.Line_No,
        No: article.No,
        Description: article.Description,
        Unit_Price: article.Unit_Price,
        Quantity: article.Quantity,
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
      body: JSON.stringify(lignes),
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
    }
    res.send(`New Entete with No ${newNo} and Lignes added successfully`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error occurred");
  }
});


// Route to get all user saved avoirs data
router.get("/getAll", async (req, res) => {
  try {
    const userNo = req.query.userNo; // userNo is sent as a query parameter
    const avoirsString = await getAllAvoirsFromBC(userNo);
    const avoir = JSON.parse(avoirsString);
    res.json(avoir);
  } catch (error) {
    console.error(
      "Error retrieving commande data from Business Central:",
      error.message
    );
    res
      .status(500)
      .send("Error retrieving commande data from Business Central");
  }
});


async function getAllAvoirsFromBC(userNo) {
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const domain = process.env.DOMAIN;
  const workstation = process.env.WORKSTATION;
  const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
  const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/SavedAvoirs`;

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
        try {
          const avoirs = JSON.parse(res.body).value;
          const filteredAvoirs = avoirs.filter((av) => av.SellToPhoneNo === userNo);
          resolve(JSON.stringify(filteredAvoirs));
        } catch (error) {
          console.error('Error parsing or filtering avoirs:', error);
          reject(error);
        }
      }
    });
  });
}



// Route to get lastest lignes Avoir data
router.get("/getLignes", async (req, res) => {
  try {
    const avNo = req.query.avNo; // avNo is sent as a query parameter
    const lignesAvoirstring = await getLignesAvoirFromBC(avNo);
    const lignesAvoir = JSON.parse(lignesAvoirstring);
    res.json(lignesAvoir);
  } catch (error) {
    console.error(
      "Error retrieving Avoir data from Business Central:",
      error.message
    );
    res
      .status(500)
      .send("Error retrieving Avoir data from Business Central");
  }
});

//get filtered list of lignes Avoirs
async function getLignesAvoirFromBC(avNo) {
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const domain = process.env.DOMAIN;
  const workstation = process.env.WORKSTATION;
  const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
  const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/LignesSavedAvoirs`;

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
        try {
          const lignesAvoirs = JSON.parse(res.body).value;
          const filteredLignesAvoirs = lignesAvoirs.filter((fac) => fac.Document_No === avNo);
          
          resolve(JSON.stringify(filteredLignesAvoirs));
        } catch (error) {
          console.error('Error parsing or filtering Avoirs:', error);
          reject(error);
        }
      }
    });
  });
}
module.exports = router;
