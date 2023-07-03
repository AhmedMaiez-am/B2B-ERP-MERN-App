const express = require("express");
const router = express.Router();
const httpntlm = require("httpntlm");

// Route to get lastest commande data
router.get("/", async (req, res) => {
    try {
      const userNo = req.query.userNo; // Assuming the userNo is sent as a query parameter
      const commandeString = await getCommandeFromBC(userNo);
      const commande = JSON.parse(commandeString);
      res.json(commande);
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
  

  async function getCommandeFromBC(userNo) {
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
          try {
            const commandes = JSON.parse(res.body).value;
            const filteredCommandes = commandes.filter((cmd) => cmd.Sell_to_Customer_No === userNo);
            const latestCommande = filteredCommandes.reduce((prev, current) => {
              const prevDate = new Date(prev.Posting_Date);
              const currentDate = new Date(current.Posting_Date);
              return prevDate > currentDate ? prev : current;
            }, {});
  
            resolve(JSON.stringify(latestCommande));
          } catch (error) {
            console.error('Error parsing or filtering commandes:', error);
            reject(error);
          }
        }
      });
    });
  }




  // Route to get lastest lignes commande data
router.get("/getLignes", async (req, res) => {
    try {
      const cmdNo = req.query.cmdNo; // userNo is sent as a query parameter
      const lignesCommandeString = await getLignesCommandeFromBC(cmdNo);
      const lignesCommande = JSON.parse(lignesCommandeString);
      res.json(lignesCommande);
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
  
//get filtered list of lignes commandes
  async function getLignesCommandeFromBC(cmdNo) {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const domain = process.env.DOMAIN;
    const workstation = process.env.WORKSTATION;
    const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
    const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/ccv`;
  
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
            const lignesCommandes = JSON.parse(res.body).value;
            const filteredLignesCommandes = lignesCommandes.filter((cmd) => cmd.Document_No === cmdNo);
            
            resolve(JSON.stringify(filteredLignesCommandes));
          } catch (error) {
            console.error('Error parsing or filtering commandes:', error);
            reject(error);
          }
        }
      });
    });
  }

// Route to delete a commande
router.delete("/delete", async (req, res) => {
  try {
    const commandeData = req.body; // Access the JSON array sent in the request body
    const commandeNo = commandeData.No; 
    const commandeType = commandeData.Document_Type;
    
    // Perform the deletion operation in Business Central using the commandeNo
    await deleteCommandeFromBC(commandeNo, commandeType);
    res.status(200).send("Commande deleted successfully");
  } catch (error) {
    console.error("Error deleting commande from Business Central:", error.message);
    res.status(500).send("Error deleting commande from Business Central");
  }
});

async function deleteCommandeFromBC(commandeNo, commandeType) {
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const domain = process.env.DOMAIN;
  const workstation = process.env.WORKSTATION;
  const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
  const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/commandeV(Document_Type=('${commandeType}'),No=('${commandeNo}'))`;
  const options = {
    url: url,
    method: "DELETE",
    username: username,
    password: password,
    workstation: workstation,
    domain: domain,
  };
  return new Promise((resolve, reject) => {
    httpntlm.delete(options, (err, response) => { 
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


// Route to delete a commande
router.delete("/delete1", async (req, res) => {
  try {
    const commandeData = req.body; // Access the JSON array sent in the request body
    const firstCommande = commandeData[0];
    const commandeNo = firstCommande.No; 
    const commandeType = firstCommande.Document_Type;
    
    // Perform the deletion operation in Business Central using the commandeNo
    await deleteCommandeFromBC(commandeNo, commandeType);
    res.status(200).send("Commande deleted successfully");
  } catch (error) {
    console.error("Error deleting commande from Business Central:", error.message);
    res.status(500).send("Error deleting commande from Business Central");
  }
});

async function deleteCommandeFromBC(commandeNo, commandeType) {
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const domain = process.env.DOMAIN;
  const workstation = process.env.WORKSTATION;
  const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
  const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/commandeV(Document_Type=('${commandeType}'),No=('${commandeNo}'))`;
  const options = {
    url: url,
    method: "DELETE",
    username: username,
    password: password,
    workstation: workstation,
    domain: domain,
  };
  return new Promise((resolve, reject) => {
    httpntlm.delete(options, (err, response) => { 
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}




// Route to get all user commande data
router.get("/getAll", async (req, res) => {
  try {
    const userNo = req.query.userNo; // userNo is sent as a query parameter
    const commandeString = await getAllCommandeFromBC(userNo);
    const commande = JSON.parse(commandeString);
    res.json(commande);
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
        try {
          const commandes = JSON.parse(res.body).value;
          const filteredCommandes = commandes.filter((cmd) => cmd.Sell_to_Customer_No === userNo);

          resolve(JSON.stringify(filteredCommandes));
        } catch (error) {
          console.error('Error parsing or filtering commandes:', error);
          reject(error);
        }
      }
    });
  });
}


// Route to get all user commande data
router.get("/details", async (req, res) => {
  try {
    const orderNo = req.query.No; // No is sent as a query parameter
    const commandeString = await getDetailsCommandeFromBC(orderNo);
    const commande = JSON.parse(commandeString);
    res.json(commande);
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


async function getDetailsCommandeFromBC(orderNo) {
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
        try {
          const commandes = JSON.parse(res.body).value;
          const filteredCommandes = commandes.filter((cmd) => cmd.No === orderNo);

          resolve(JSON.stringify(filteredCommandes));
        } catch (error) {
          console.error('Error parsing or filtering commandes:', error);
          reject(error);
        }
      }
    });
  });
}


module.exports = router;
