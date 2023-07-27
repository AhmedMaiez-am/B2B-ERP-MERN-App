const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const httpntlm = require("httpntlm");
const { check, validationResult } = require("express-validator");
const SecretCode = require("../models/SecretCode");
const nodemailer = require("nodemailer");
const salt = bcrypt.genSaltSync(10);
const axios = require("axios");

async function SendMail(user, code) {
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
    to: user.email,
    // Subject of the message
    subject: "Récuprération du mot de passe",
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
          <h1 class="title">Votre demande de changement de mot de passe</h1>
        </div>
        <div class="content">
          <p>Bonjour Mr/Mme <strong>${user.lastname} ${user.firstname},</strong></p>
          <p>Nous avons reçu votre demande pour changer votre mot de passe.</p>
          <p>Veuillez trouvez ci-dessous le code pour confirmer votre identité afin de changer le mot de passe:</p>
          <h2 style="font-size: 36px; font-weight: bold;">${code}</h2>
          <p>Vous pouvez utiliser ce code seulement une fois.</p>
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

router.post(
  "/signup",
  [
    check("no", "Veuillez vérifier vote identifiant unique").not().isEmpty(),
    check("name", "Veuillez insérer votre nom et prénom").not().isEmpty(),
    check("email", "Veuillez insérer votre adresse email").not().isEmpty(),
    check(
      "password",
      "Veuillez insérer votre mot de passe avec un minimum de 6 caractères"
    ).isLength({ min: 6 }),
    check("tel", "Veuillez insérer votre numèro de telephone").not().isEmpty(),
    check("address", "Veuillez insérer votre adresse").not().isEmpty(),
    check("address", "Veuillez insérer votre adresse").not().isEmpty(),
    check("genBusGroup", "Veuillez sélectionner votre type commercial")
      .not()
      .isEmpty(),
    check("customerGroup", "Veuillez sélectionner le type du marché")
      .not()
      .isEmpty(),
    check("code_magasin", "Veuillez sélectionner votre code du magasin")
      .not()
      .isEmpty(),
    check("codeLivraison", "Veuillez sélectionner le code de livraison")
      .not()
      .isEmpty(),
    check("codeTVA", "Veuillez sélectionner le code TVA").not().isEmpty(),
    check("paymentTerm", "Veuillez sélectionner le terme de paiement")
      .not()
      .isEmpty(),
    check("paymentCode", "Veuillez sélectionner le code de paiement")
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        no,
        name,
        email,
        password,
        tel,
        address,
        genBusGroup,
        customerGroup,
        code_magasin,
        codeLivraison,
        codeTVA,
        paymentTerm,
        paymentCode,
      } = req.body;

      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .send({ errors: [{ msg: "Utilisateur existe déjà" }] });
      }

      user = new User({
        no,
        name,
        email,
        password,
        tel,
        address,
        genBusGroup,
        customerGroup,
        code_magasin,
        codeLivraison,
        codeTVA,
        paymentTerm,
        paymentCode,
      });
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        id: user.id,
      };

      // create a token using json webtoken
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "2h",
      });
      res.status(200).send({ user, token });
    } catch (err) {
      console.error(err.message);
      res
        .status(400)
        .send({ errors: [{ msg: "Création du compte échoué", error: err }] });
    }
  }
);

//login
router.post(
  "/",
  [
    check("email", "Veuillez vérifier votre email").isEmail(),
    check(
      "password",
      "Veuillez insérer une mot de passe de plus 6 caractères"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;

      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send({
          errors: [{ msg: "Veuillez verifier vos paramètres de connexion" }],
        });
      }

      // Check password
      const result = await bcrypt.compare(password, user.password);

      if (!result) {
        res.status(400).send({
          errors: [{ msg: "Veuillez verifier vos paramètres de connexion" }],
        });
        return;
      }

      // create a token using json webtoken
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "2h" }
      );
      res.status(200).send({ user, token });
    } catch (err) {
      console.error(err.message);
      res.status(400).send({ errors: [{ msg: "Login échoué", error: err }] });
    }
  }
);

//send secret code to mail
router.post("/resetPassword", async (req, res) => {
  try {
    // Get email from req.body
    const { email } = req.body;

    // Check user
    const finduser = await User.findOne({ email });
    if (!finduser) {
      return res.status(400).send({ msg: "Compte non trouvé" });
    }

    // Generate Secret Code
    const code = Math.floor(100000 + Math.random() * 900000);

    // Save code in DB with user id
    const newcode = new SecretCode({ user: finduser, code });
    await newcode.save();
    // Send Email to user
    SendMail(finduser, code);
    res.status(200).send({
      msg: "Veuillez consulter votre email pour la récupération du code",
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ msg: "Récupération du mot de passe échouée", error });
  }
});

//submit secret code from mail
router.post("/CheckSecretCode", async (req, res) => {
  try {
    // Get secret code from req.body
    const { code } = req.body;
    // find secret code
    const findcode = await SecretCode.findOne({ code })
      .populate("user")
      .sort({ _id: -1 })
      .limit(1);
    if (!findcode) {
      return res.status(400).send({ msg: "Code invalide !" });
    }
    // send ok
    res.status(200).send({ msg: "Code Valide", findcode });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "Vérification du code échouée", error });
  }
});

//reset new password
router.put("/resetNewPassword/:id", async (req, res) => {
  try {
    // Get new and confirm password from req.body
    const { newpass, confirmpass } = req.body;
    // Get user id from req.params
    const { id } = req.params;
    // Check if 2 password is equal
    if (newpass !== confirmpass) {
      return res
        .status(400)
        .send({ msg: "Les mots de passe ne sont pas identiques" });
    }
    // replace password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(newpass, salt);
    await User.updateOne({ _id: id }, { $set: { password: hashedpassword } });

    res.status(200).send({ msg: "Mot de passe changé !" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "Changement du mot de passe echoué", error });
  }
});

//ajout user
router.post("/addUser", async (req, res, next) => {
  try {
    const newUser = new User({
      no: req.body.no,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      tel: req.body.tel,
      address: req.body.address,
      genBusGroup: req.body.genBusGroup,
      customerGroup: req.body.customerGroup,
      code_magasin: req.body.code_magasin,
      codeLivraison: req.body.codeLivraison,
      codeTVA: req.body.codeTVA,
      paymentTerm: req.body.paymentTerm,
      paymentCode: req.body.paymentCode,
    });
    // Hash password
    const hashedpassword = bcrypt.hashSync(newUser.password, salt);
    newUser.password = hashedpassword;
    await newUser.save();

    // Create a new user in ChatEngine using the username and password from the newly created user
    const chatEngineUser = {
      username: req.body.name, // Use the 'no' field as the username for ChatEngine
      secret: req.body.tel, // Use the 'password' field as the secret for ChatEngine
    };

    const chatEngineConfig = {
      method: "post",
      url: "https://api.chatengine.io/users/",
      headers: {
        "PRIVATE-KEY": "dd5c075f-9b51-49fc-9be5-f0418aca3de2", // Replace with your ChatEngine private key
      },
      data: chatEngineUser,
    };

    try {
      // Send the new user data to ChatEngine
      await axios(chatEngineConfig);
    } catch (error) {
      console.error("Error creating user in ChatEngine:", error);
      res.status(500).send("Error creating user in ChatEngine");
      return;
    }

    try {
      //insert new client to business central
      const BC_user = {
        No: req.body.no,
        Name: req.body.name,
        Address: req.body.address,
        Phone_No: req.body.tel,
        E_Mail: req.body.email,
        Gen_Bus_Posting_Group: req.body.genBusGroup,
        Customer_Posting_Group: req.body.customerGroup,
        Location_Code: req.body.code_magasin,
        Shipment_Method_Code: req.body.codeLivraison,
        VAT_Bus_Posting_Group: req.body.codeTVA,
        Payment_Terms_Code: req.body.paymentTerm,
        Payment_Method_Code: req.body.paymentCode,
      };
      const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
      const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/ficheclient`;
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
        body: JSON.stringify(BC_user),
      };
      try {
        // send the new record data to Business Central
        const response = await new Promise((resolve, reject) => {
          httpntlm.post(options, (err, res) => {
            if (err) reject(err);
            else resolve(res);
          });
        });
        // Check the response for any errors
        if (response.statusCode !== 201) {
          console.error(
            "Error creating ligne in Business Central:",
            response.statusCode,
            response.statusMessage
          );
          res.status(500).send("Error creating user in Business Central");
          return;
        }
      } catch (error) {
        console.error("Error sending user data to Business Central:", error);
        res.status(500).send("Error sending user data to Business Central");
        return;
      }
      res.send(`User ${BC_user.Name} added successfully to Business Central`);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Error occurred");
    }
  } catch (error) {
    console.log(error);
  }
});


// Function to get the existing user from Business Central based on userId
async function getExistingUser(userId) {
  try {
    const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
    const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/ficheclient?$filter=No eq '${userId}'`;

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
    };

    const response = await new Promise((resolve, reject) => {
      httpntlm.get(options, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });

    // Check the response for any errors
    if (response.statusCode !== 200) {
      throw new Error("Error getting user from Business Central");
    }

    // Access the user object directly from the response body
    const user = JSON.parse(response.body);

    // Check if the user was found
    if (!user || !user.value || user.value.length === 0) {
      throw new Error("User not found");
    }

    // Return the first user in the 'value' array (assuming there is only one user with the given ID)
    return {
      user: user.value[0],
      etag: user.value[0]["@odata.etag"], // Retrieve the ETag value from the user object
    };
  } catch (error) {
    throw error;
  }
}


// Update user
router.post("/updateUser", async (req, res, next) => {
  try {
    let userId = req.body.no; // Extract the user ID from the request body
    userId = userId.toString();
    const updatedUser = {
      No: req.body.no,
      Name: req.body.name,
      Address: req.body.address,
      Phone_No: req.body.tel,
      E_Mail: req.body.email,
      Gen_Bus_Posting_Group: req.body.genBusGroup,
      Customer_Posting_Group: req.body.customerGroup,
      Location_Code: req.body.code_magasin,
      Shipment_Method_Code: req.body.codeLivraison,
      VAT_Bus_Posting_Group: req.body.codeTVA,
      Payment_Terms_Code: req.body.paymentTerm,
      Payment_Method_Code: req.body.paymentCode,
    };

    // Get the existing user and ETag value
    const { user, etag } = await getExistingUser(userId);
    if (!user || !etag) {
      throw new Error("User not found or ETag value not available.");
    }

    // Update the user in Business Central
    const encodedCompanyId = encodeURIComponent("CRONUS France S.A.");
    const url = `http://${process.env.SERVER}:7048/BC210/ODataV4/Company('${encodedCompanyId}')/ficheclient('${userId}')`;

    const options = {
      url: url,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      workstation: process.env.WORKSTATION,
      domain: process.env.DOMAIN,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "If-Match": etag, // Use the retrieved ETag value in the request headers
      },
      json: true,
      body: JSON.stringify(updatedUser),
    };

    try {
      // Send the update data to Business Central using 'PATCH' method
      const response = await new Promise((resolve, reject) => {
        httpntlm.patch(options, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      });

      // Check the response for any errors
      if (response.statusCode !== 200) {
        console.error(
          "Error updating user in Business Central:",
          response.statusCode,
          response.statusMessage
        );
        res.status(500).send("Error updating user in Business Central");
        return;
      }

      // Update the user in MongoDB
      const newMongoUser = {
        no: updatedUser.No,
        name: updatedUser.Name,
        address: updatedUser.Address,
        tel: updatedUser.Phone_No,
        email: updatedUser.E_Mail,
        genBusGroup: updatedUser.Gen_Bus_Posting_Group,
        customerGroup: updatedUser.Customer_Posting_Group,
        code_magasin: updatedUser.Location_Code,
        codeLivraison: updatedUser.Shipment_Method_Code,
        codeTVA: updatedUser.VAT_Bus_Posting_Group,
        paymentTerm: updatedUser.Payment_Terms_Code,
        paymentCode: updatedUser.Payment_Method_Code,
      };
      const updatedMongoUser = await User.findOneAndUpdate({ no: userId }, newMongoUser);

      if (!updatedMongoUser) {
        // Handle the case when the user with the specified 'no' is not found in MongoDB
        console.error("User not found in MongoDB");
        res.status(404).send("User not found in MongoDB");
        return;
      }

      res.json(newMongoUser);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Error occurred");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error occurred");
  }
});



module.exports = router;
