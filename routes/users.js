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
    check("codeTVA", "Veuillez sélectionner le code TVA")
      .not()
      .isEmpty(),
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
        paymentCode
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
        paymentCode
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
      paymentCode: req.body.paymentCode
    });
    // Hash password
    const hashedpassword = bcrypt.hashSync(newUser.password, salt);
    newUser.password = hashedpassword;
    await newUser.save();
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
        Payment_Method_Code: req.body.paymentCode
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

//get user by id
router.get("/getUser/:id", async (req, res) => {
  let id = req.params.id;
  User.findById(id, function (err, user) {
    res.json(user);
  });
});

//update user
router.post("/updateUser/:id", async (req, res) => {
  User.findById(req.params.id, function (err, user) {
    if (!user) res.status(404).send("Utilisateur non trouvé");
    else user.lastname = req.body.lastname;
    user.firstname = req.body.firstname;
    user.email = req.body.email;
    user.tel = req.body.tel;
    user.entreprise = req.body.entreprise;

    user.save();
    res.send({ msg: "Utilisateur modifié" });
  });
});

//update lastname
router.post("/updateLastname/:id", async (req, res) => {
  User.findById(req.params.id, function (err, user) {
    if (!user) res.status(404).send("Utilisateur non trouvé");
    else user.lastname = req.body.lastname;
    user.save();
    res.send({ msg: "Nom modifié" });
  });
});

//update firstname
router.post("/updateFirstname/:id", async (req, res) => {
  User.findById(req.params.id, function (err, user) {
    if (!user) res.status(404).send("Utilisateur non trouvé");
    else user.firstname = req.body.firstname;
    user.save();
    res.send({ msg: "Prenom modifié" });
  });
});

//update email
router.post("/updateEmail/:id", async (req, res) => {
  User.findById(req.params.id, function (err, user) {
    if (!user) res.status(404).send("Utilisateur non trouvé");
    else user.email = req.body.email;
    user.save();
    res.send({ msg: "Email modifié" });
  });
});

//update tel
router.post("/updateTel/:id", async (req, res) => {
  User.findById(req.params.id, function (err, user) {
    if (!user) res.status(404).send("Utilisateur non trouvé");
    else user.tel = req.body.tel;
    user.save();
    res.send({ msg: "Tel modifié" });
  });
});

//update entreprise
router.post("/updateEntreprise/:id", async (req, res) => {
  User.findById(req.params.id, function (err, user) {
    if (!user) res.status(404).send("Utilisateur non trouvé");
    else user.entreprise = req.body.entreprise;
    user.save();
    res.send({ msg: "Entreprise modifié" });
  });
});

module.exports = router;
