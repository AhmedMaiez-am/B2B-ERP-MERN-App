const express = require("express");
const router = express.Router();
const httpntlm = require("httpntlm");
const Entete = require("../models/EnteteVente.js");
const nodemailer = require("nodemailer");

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
    const BC_user = req.body.user;
    const newEntete = {
      Document_Type: "Order",
      No: newNo.toString(),
      Sell_to_Customer_No: BC_user.no,
      Sell_to_Customer_Name: BC_user.name
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

    // Get the articles from the request body
    const articles = req.body.articles; 

    // Send each article as a separate ligne object to Business Central
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];

      const ligne = {
        Type: "Item",
        Document_Type: "Order",
        Document_No: newNo.toString(),
        Line_No: i + 1,
        No: article.id,
        Description: article.description,
        Unit_Price: article.prixUni,
        Quantity: article.quantity,
        Qty_to_Ship: article.quantity
      };
      const encodedCompanyId1 = encodeURIComponent("CRONUS France S.A.");
      const urlLigne = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId1}')/ccv`;
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
    }
    SendMail(BC_user,newNo)
    res.send(`New Entete with No ${newNo} and Lignes added successfully`);
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error occurred");
  }

});


//send mail on successfull commande insertion
async function SendMail(BC_user, newNo) {
  // Create a SMTP transporter object
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "maiezahmed98@gmail.com",
      pass: "qputeyqhqoglpkao",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Message object
  let message = {
    from: "maiezahmed98@gmail.com",
    to: BC_user.email,
    // Subject of the message
    subject: "Enregistrement d'une nouvelle commande",
    // plaintext body
    // text: msg,
    html: `
    <html>
    <head>
      <style>
        /* Add your styles here */
        body {
          font-family: Arial, sans-serif;
          font-size: 16px;
          line-height: 1.5;
        }

        .container {
          margin: 0 auto;
          max-width: 600px;
          padding: 20px;
          text-align: center;
        }

        .header {
          background-color: #f5f5f5;
          border-bottom: 1px solid #ddd;
          margin-bottom: 20px;
          padding: 10px 20px;
          border-radius: 10px;
        }

        .title {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
          color:#26a4ab;
        }

        .content {
          background-color: #fff;
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 10px;
          
        }
        h2 {
            color: #7d1a1a;
            display: inline-block;
            border-radius: 10px;
        }
      </style>
      <!-- Load Bootstrap CSS -->
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">Votre commande a été bien enregistrée</h1>
        </div>
        <div class="content">
          <p>Bonjour Mr/Mme <strong>${BC_user.name} ,</strong></p>
          <p>On a le plaisir de vous informer que votre commmande a été bien enregistrée.</p>
          <p>Veuillez trouvez ci-dessous le numéro de la nouvelle commande:</p>
          <h2 style="font-size: 36px; font-weight: bold;">${newNo}</h2>
        </div>
      </div>
    </body>
  </html>
  `,
  };

  await transporter.sendMail(message, (error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent successfully!");
    }
  });
  transporter.close();
}

module.exports = router;
