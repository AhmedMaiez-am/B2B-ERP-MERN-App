const express = require("express");
const router = express.Router();
const httpntlm = require("httpntlm");
const xml2js = require("xml2js");


//Envoyer le magasin, l'article et la quantité saisie à la fonction du CodeUnit pour tester la disponnibilité de stock
async function getStockCheckFunction() {
  // Authentification au Business Central
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const domain = process.env.DOMAIN;
  const workstation = process.env.WORKSTATION;
  const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
  const url = `http://${process.env.SERVER}:7047/BC210/WS/${encodedCompanyId}/Codeunit/StockCheck`;

  console.log("Making SOAP request...");

  // Configurer les options de la requête SOAP
  const authOptions = {
    url: url,
    username: username,
    password: password,
    domain: domain,
    workstation: workstation,
    body: `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:microsoft-dynamics-schemas/codeunit/StockCheck">
        <soap:Header/>
        <soap:Body>
          <urn:GetInventory>
            <urn:itemNo>LS-75</urn:itemNo>
            <urn:location>BLEU</urn:location>
            <urn:qte>190</urn:qte>
          </urn:GetInventory>
        </soap:Body>
      </soap:Envelope>`,
    headers: {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: "urn:microsoft-dynamics-schemas/codeunit/StockCheck:GetInventory",
    },
  };

  const response = await new Promise((resolve, reject) => {
    // Envoyer la requête SOAP avec httpntlm
    httpntlm.post(authOptions, (error, res) => {
      if (error) {
        reject(error);
      } else {
        resolve(res.body);
      }
    });
  });

  console.log("SOAP request completed successfully.");

  // Extraire the réponse SOAP
  const parser = new xml2js.Parser();
  const parsedResponse = await new Promise((resolve, reject) => {
    parser.parseString(response, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });


  // Extraire la valeur de retour de la fonction du CodeUnit
  const inventory =
    parsedResponse["Soap:Envelope"]["Soap:Body"][0]["GetInventory_Result"][0]["return_value"][0];

  return inventory;
}

router.get("/getInventory", async (req, res) => {
  try {
    console.log("Calling GetInventory...");
    const inventory = await getStockCheckFunction();
    console.log("GetInventory completed successfully. Inventory:", inventory);

    res.status(200).json({ inventory });
  } catch (error) {
    console.error(
      "Error retrieving function from Business Central's CodeUnit:",
      error.message
    );
    res.status(500).send("Error retrieving function from Business Central's CodeUnit.");
  }
});

module.exports = router;
