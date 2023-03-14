const express = require("express");
const router = express.Router();
const httpntlm = require("httpntlm");
const Entete = require("../models/EnteteVente.js");

//get entete-vente from BC
async function getEnteteFromBC() {
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const domain = process.env.DOMAIN;
  const workstation = process.env.WORKSTATION;
  const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
  const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/commandeV`;

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

//route to get entete-ventes data
router.get("/", async (req, res) => {
  try {
    const entetesString = await getEnteteFromBC();
    const entetes = JSON.parse(entetesString);
    res.json(entetes);
  } catch (error) {
    console.error(
      "Error retrieving headers data from Business Central:",
      error.message
    );
    res.status(500).send("Error retrieving headers data from Business Central");
  }
});

//add the entetes data to mongodb schema
router.get("/insert", async (req, res) => {
  try {
    const entetesString = await getEnteteFromBC();
    const parsedJson = JSON.parse(entetesString);
    const entetes = parsedJson.value; // Extract the array of entetes from the 'value' property
    const enteteDocs = entetes.map((entete) => {
      return {
        num: entete.No,
        type: entete.Document_Type,
      };
    });

    // Loop through each entete document and update or insert it into the MongoDB collection
    enteteDocs.forEach(async (enteteDoc) => {
      await Entete.updateOne(
        { num: enteteDoc.num }, // Filter criteria to find existing document
        { $set: enteteDoc }, // Update the existing document or insert a new one
        { upsert: true } // Use upsert option to insert if document doesn't exist
      );
    });

    res.send("Entetes inserted successfully");
  } catch (error) {
    console.error(
      "Error retrieving entetes data from Business Central:",
      error.message
    );
    res.status(500).send("Error retrieving entetes data from Business Central");
  }
});

// add a new router function to insert a new document into Business Central
router.post("/add", async (req, res) => {
  try {
    const entetesString = await getEnteteFromBC();
    const parsedJson = JSON.parse(entetesString);
    const entetes = parsedJson.value;
    const highestNo = Math.max(...entetes.map((entete) => entete.No)); // get the highest No
    const newNo = highestNo + 1;
    const newEntete = {
      No: newNo.toString(),
      Document_Type: "Order",
    };
    const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
    const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/commandeV`;
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
      body: JSON.stringify(newEntete),
    };
    // send the new record data to Business Central
    const response = await new Promise((resolve, reject) => {
      httpntlm.post(options, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    }); 

    // parse the response body and merge the new entete into it
    const responseBody = JSON.parse(response.body);
    if (!responseBody.value) {
      responseBody.value = [];
    }
    responseBody.value.push(newEntete);

    // send the modified JSON data back to the URL
    const modifiedJson = JSON.stringify(responseBody);
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
      body: JSON.stringify(modifiedJson),
    };
    await new Promise((resolve, reject) => {
      httpntlm.put(modifiedOptions, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });

    res.send(`New Entete with No ${newNo} added successfully`);
  } catch (error) {
    console.error(
      "Error retrieving entetes data from Business Central:",
      error.message
    );
    res.status(500).send("Error retrieving entetes data from Business Central");
  }
});

module.exports = router;
