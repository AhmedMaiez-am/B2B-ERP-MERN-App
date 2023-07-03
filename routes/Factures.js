const express = require("express");
const router = express.Router();
const httpntlm = require("httpntlm");

// Route to get all user factures data
router.get("/getAll", async (req, res) => {
    try {
      const userNo = req.query.userNo; // userNo is sent as a query parameter
      const factureString = await getAllFactureFromBC(userNo);
      const facture = JSON.parse(factureString);
      res.json(facture);
    } catch (error) {
      console.error(
        "Error retrieving facture data from Business Central:",
        error.message
      );
      res
        .status(500)
        .send("Error retrieving facture data from Business Central");
    }
  });
  
  
  async function getAllFactureFromBC(userNo) {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const domain = process.env.DOMAIN;
    const workstation = process.env.WORKSTATION;
    const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
    const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/enteteFactures`;
  
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
            const factures = JSON.parse(res.body).value;
            const filteredFactures = factures.filter((fac) => fac.SellToPhoneNo === userNo);
  
            resolve(JSON.stringify(filteredFactures));
          } catch (error) {
            console.error('Error parsing or filtering factures:', error);
            reject(error);
          }
        }
      });
    });
  }


  // Route to get lastest lignes facture data
router.get("/getLignes", async (req, res) => {
    try {
      const facNo = req.query.facNo; // facNo is sent as a query parameter
      const lignesCommandeString = await getLignesFactureFromBC(facNo);
      const lignesCommande = JSON.parse(lignesCommandeString);
      res.json(lignesCommande);
    } catch (error) {
      console.error(
        "Error retrieving facture data from Business Central:",
        error.message
      );
      res
        .status(500)
        .send("Error retrieving facture data from Business Central");
    }
  });
  
//get filtered list of lignes factures
  async function getLignesFactureFromBC(facNo) {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const domain = process.env.DOMAIN;
    const workstation = process.env.WORKSTATION;
    const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
    const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/lignesFactures`;
  
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
            const lignesFactures = JSON.parse(res.body).value;
            const filteredLignesFactures = lignesFactures.filter((fac) => fac.Document_No === facNo);
            
            resolve(JSON.stringify(filteredLignesFactures));
          } catch (error) {
            console.error('Error parsing or filtering factures:', error);
            reject(error);
          }
        }
      });
    });
  }



  // Route to get all user facture data
router.get("/details", async (req, res) => {
    try {
      const invoiceNo = req.query.No; // No is sent as a query parameter
      const commandeString = await getDetailsFacturesFromBC(invoiceNo);
      const commande = JSON.parse(commandeString);
      res.json(commande);
    } catch (error) {
      console.error(
        "Error retrieving facture data from Business Central:",
        error.message
      );
      res
        .status(500)
        .send("Error retrieving facture data from Business Central");
    }
  });
  
  
  async function getDetailsFacturesFromBC(invoiceNo) {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const domain = process.env.DOMAIN;
    const workstation = process.env.WORKSTATION;
    const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
    const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/enteteFactures`;
  
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
            const factures = JSON.parse(res.body).value;
            const filteredFactures = factures.filter((fac) => fac.No === invoiceNo);
  
            resolve(JSON.stringify(filteredFactures));
          } catch (error) {
            console.error('Error parsing or filtering factures:', error);
            reject(error);
          }
        }
      });
    });
  }
module.exports = router;
