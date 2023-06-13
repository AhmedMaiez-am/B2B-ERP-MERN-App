const express = require("express");
const router = express.Router();
const httpntlm = require("httpntlm");

// Function to handle errors consistently
function handleError(res, errorMessage) {
  console.error(errorMessage);
  res.status(500).send(errorMessage);
}

// Get entete-Clients from BC
async function getClientsFromBC() {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const domain = process.env.DOMAIN;
    const workstation = process.env.WORKSTATION;
    const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
    const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/clients`;
  
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
            try {
                const clients = JSON.parse(res.body).value;
                resolve(JSON.stringify(clients));
              } catch (error) {
                console.error('Error parsing or filtering avoirs:', error);
                reject(error);
              }
        }
      });
    });
  }

  // Route to get all clients data
router.get("/getAll", async (req, res) => {
    try {
      const clientsString = await getClientsFromBC();
      const client = JSON.parse(clientsString);
      res.json(client);
    } catch (error) {
      console.error(
        "Error retrieving client data from Business Central:",
        error.message
      );
      res
        .status(500)
        .send("Error retrieving client data from Business Central");
    }
  });



  // Route to delete a client
router.delete("/delete", async (req, res) => {
    try {
        const clientData = req.body;
        const firstClient = clientData[0]; // Access the first object in the array
        const clientNo = firstClient.No; // Access the value of the 'No' property

      // Perform the deletion operation in Business Central using the clientNo
      await deleteclientFromBC(clientNo);
      res.status(200).send("client deleted successfully");
    } catch (error) {
      console.error("Error deleting client from Business Central:", error.message);
      res.status(500).send("Error deleting client from Business Central");
    }
  });
  
  async function deleteclientFromBC(clientNo) {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const domain = process.env.DOMAIN;
    const workstation = process.env.WORKSTATION;
    const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
    const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/clients(No=('${clientNo}'))`;
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


  // Route to get all user client data
router.get("/details", async (req, res) => {
    try {
      const clientNo = req.query.No; // No is sent as a query parameter
      const clientString = await getDetailsclientFromBC(clientNo);
      const client = JSON.parse(clientString);
      res.json(client);
    } catch (error) {
      console.error(
        "Error retrieving client data from Business Central:",
        error.message
      );
      res
        .status(500)
        .send("Error retrieving client data from Business Central");
    }
  });
  
  
  async function getDetailsclientFromBC(clientNo) {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const domain = process.env.DOMAIN;
    const workstation = process.env.WORKSTATION;
    const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
    const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/clients`;
  
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
            const clients = JSON.parse(res.body).value;
            const filteredclients = clients.filter((clt) => clt.No === clientNo);
  
            resolve(JSON.stringify(filteredclients));
          } catch (error) {
            console.error('Error parsing or filtering clients:', error);
            reject(error);
          }
        }
      });
    });
  }
module.exports = router;
