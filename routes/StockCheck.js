const express = require("express");
const router = express.Router();
const httpntlm = require("httpntlm");
const xml2js = require("xml2js");

//Envoyer le magasin, l'article et la quantité saisie à la fonction du CodeUnit pour tester la disponnibilité de stock
async function getStockCheckFunction(articleId, magasin, quantity) {
  // Authentification au Business Central
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const domain = process.env.DOMAIN;
  const workstation = process.env.WORKSTATION;
  const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
  const url = `http://${process.env.SERVER}:7047/BC210/WS/${encodedCompanyId}/Codeunit/StockCheck`;

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
            <urn:itemNo>${articleId}</urn:itemNo>
            <urn:location>${magasin}</urn:location>
            <urn:qte>${quantity}</urn:qte>
          </urn:GetInventory>
        </soap:Body>
      </soap:Envelope>`,
    headers: {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction:
        "urn:microsoft-dynamics-schemas/codeunit/StockCheck:GetInventory",
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
    parsedResponse["Soap:Envelope"]["Soap:Body"][0]["GetInventory_Result"][0][
      "return_value"
    ][0];

  return inventory;
}

//Envoyer le magasin, l'article, la quantité saisie et la résultat de getInventory() à la fonction du CodeUnit pour récupérer le magasin valide
async function getMagasinCheckFunction(
  articleId,
  magasin,
  quantity,
  inventory
) {
  // Authentification au Business Central
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const domain = process.env.DOMAIN;
  const workstation = process.env.WORKSTATION;
  const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
  const url = `http://${process.env.SERVER}:7047/BC210/WS/${encodedCompanyId}/Codeunit/StockCheck`;

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
          <urn:GetLocationPerQte>
            <urn:itemNo>${articleId}</urn:itemNo>
            <urn:location>${magasin}</urn:location>
            <urn:qte_saisie>${quantity}</urn:qte_saisie>
            <urn:stock_P>${inventory}</urn:stock_P>
          </urn:GetLocationPerQte>
        </soap:Body>
      </soap:Envelope>`,
    headers: {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction:
        "urn:microsoft-dynamics-schemas/codeunit/StockCheck:GetLocationPerQte",
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
  const magasinValide =
    parsedResponse["Soap:Envelope"]["Soap:Body"][0][
      "GetLocationPerQte_Result"
    ][0]["return_value"][0];

  return magasinValide;
}

async function getMaxQtePerLocationFunction(
  articleId,
) {
  // Authentification au Business Central
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;
  const domain = process.env.DOMAIN;
  const workstation = process.env.WORKSTATION;
  const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
  const url = `http://${process.env.SERVER}:7047/BC210/WS/${encodedCompanyId}/Codeunit/StockCheck`;

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
          <urn:GetMaxQtyPerLocation>
            <urn:itemNo>${articleId}</urn:itemNo>
          </urn:GetMaxQtyPerLocation>
        </soap:Body>
      </soap:Envelope>`,
    headers: {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction:
        "urn:microsoft-dynamics-schemas/codeunit/StockCheck:GetMaxQtyPerLocation",
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
  const magasinValide =
    parsedResponse["Soap:Envelope"]["Soap:Body"][0][
      "GetMaxQtyPerLocation_Result"
    ][0]["return_value"][0];

  return magasinValide;
}

router.post("/getInventory", async (req, res) => {
  try {
    const { articleId, magasin, quantity } = req.body;

    // Call the backend function passing the parameters
    const inventory = await getStockCheckFunction(articleId, magasin, quantity);

    //Si la quantité saisie est inférieur à la quantité en stock de la magasin choisi
    if (inventory >= quantity) {
      res.status(200).json({ inventory });
    } else {
      const magasinValide = await getMagasinCheckFunction(
        articleId,
        magasin,
        quantity,
        inventory
      );

      //Si la quantité saisie n'est pas disponible en stock dans tous les magasins, retourner la quantité maximal disponible
      if (magasinValide === "") {
        const maxQtePerLocation = await getMaxQtePerLocationFunction(articleId);
        res.status(200).json({maxQtePerLocation});
      } else {
        //Si la quantité saisie est disponnible en stock dans un autre magasin, retourner le magasin valide
        res.status(200).json({magasinValide});
      }
    }
  } catch (error) {
    console.error("Error retrieving inventory:", error.message);
    res.status(500).send("Error retrieving inventory.");
  }
});

module.exports = router;
