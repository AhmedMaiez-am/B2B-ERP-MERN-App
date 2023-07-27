const express = require("express");
const router = express.Router();
const httpntlm = require("httpntlm");


//Get Commande Count
async function getCommandesCountFromBC(customerNo) {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const domain = process.env.DOMAIN;
    const workstation = process.env.WORKSTATION;
    const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
  
    // Build the URL with an additional $filter query parameter to filter by customer No
    const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/commandeV?$filter=Sell_to_Customer_No eq '${customerNo}'`;
  
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
          const response = JSON.parse(res.body);
          const commandesCount = response.value.length;
          resolve(commandesCount);
        }
      });
    });
  }
  
  // Route to get the count of commandes for a specific customer No
  router.get("/commandes", async (req, res) => {
    try {
      const customerNo = req.query.No;
      if (!customerNo) {
        throw new Error("Customer No parameter missing.");
      }
  
      const commandesCount = await getCommandesCountFromBC(customerNo);
      res.json({ commandesCount });
    } catch (error) {
      console.error("Error retrieving commandes count from Business Central:", error.message);
      res.status(500).send("Error retrieving commandes count from Business Central");
    }
  });




//Get Facture Count
async function getFacturesCountFromBC(customerNo) {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const domain = process.env.DOMAIN;
    const workstation = process.env.WORKSTATION;
    const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
  
    // Build the URL with an additional $filter query parameter to filter by customer No
    const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/enteteFactures?$filter=Sell_to_Customer_Name eq '${customerNo}'`;
  
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
          const response = JSON.parse(res.body);
          const facturesCount = response.value.length;
          resolve(facturesCount);
        }
      });
    });
  }
  
  // Route to get the count of commandes for a specific customer No
  router.get("/factures", async (req, res) => {
    try {
      const customerNo = req.query.No;
      if (!customerNo) {
        throw new Error("Customer No parameter missing.");
      }
  
      const facturesCount = await getFacturesCountFromBC(customerNo);
      res.json({ facturesCount });
    } catch (error) {
      console.error("Error retrieving factures count from Business Central:", error.message);
      res.status(500).send("Error retrieving factures count from Business Central");
    }
  });
  



  //Get Avoir Count
async function getAvoirsCountFromBC(customerNo) {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const domain = process.env.DOMAIN;
    const workstation = process.env.WORKSTATION;
    const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
  
    // Build the URL with an additional $filter query parameter to filter by customer No
    const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/SavedAvoirs?$filter=Sell_to_Customer_Name eq '${customerNo}'`;
  
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
          const response = JSON.parse(res.body);
          const avoirsCount = response.value.length;
          resolve(avoirsCount);
        }
      });
    });
  }
  
  // Route to get the count of commandes for a specific customer No
  router.get("/avoirs", async (req, res) => {
    try {
      const customerNo = req.query.No;
      if (!customerNo) {
        throw new Error("Customer No parameter missing.");
      }
  
      const avoirsCount = await getAvoirsCountFromBC(customerNo);
      res.json({ avoirsCount });
    } catch (error) {
      console.error("Error retrieving avoirs count from Business Central:", error.message);
      res.status(500).send("Error retrieving avoirs count from Business Central");
    }
  });


module.exports = router;