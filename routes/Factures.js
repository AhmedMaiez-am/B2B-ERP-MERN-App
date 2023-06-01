const express = require("express");
const router = express.Router();
const httpntlm = require("httpntlm");

// Route to get all user commande data
router.get("/getAll", async (req, res) => {
    try {
      const userNo = req.query.userNo; // userNo is sent as a query parameter
      const factureString = await getAllCommandeFromBC(userNo);
      const facture = JSON.parse(factureString);
      res.json(facture);
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
  
  
  async function getAllCommandeFromBC(userNo) {
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
            const filteredFactures = factures.filter((cmd) => cmd.SellToPhoneNo === userNo);
  
            resolve(JSON.stringify(filteredFactures));
          } catch (error) {
            console.error('Error parsing or filtering commandes:', error);
            reject(error);
          }
        }
      });
    });
  }
module.exports = router;
