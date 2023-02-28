const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
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
    html: `<div>
            <p><strong>Bonjour ${user.lastname}</strong></p>\
             <br>
             <p> Veuillez trouver ici le code de récupération de votre mot de passe : <span style="font-weight:500"> <strong>${code} </strong></span> </p>
             </div>`,
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
    check("lastname", "Veuillez insérer votre nom").not().isEmpty(),
    check("firstname", "Veuillez insérer votre prenom").not().isEmpty(),
    check("email", "Veuillez insérer votre adresse email").not().isEmpty(),
    check(
      "password",
      "Veuillez insérer votre mot de passe avec un minimum de 6 caractères"
    ).isLength({ min: 6 }),
    check("tel", "Veuillez insérer votre numèro de telephone").not().isEmpty(),
    check("entreprise", "Veuillez insérer le libelle de votre entreprise").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { lastname, firstname, email, password, tel, entreprise } = req.body;

      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .send({ errors: [{ msg: "Utilisateur existe déjà" }] });
      }

      user = new User({
        lastname,
        firstname,
        email,
        password,
        tel,
        entreprise
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
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      email: req.body.email,
      password: req.body.password,
      tel: req.body.tel,
      entreprise: req.body.entreprise
    });
    // Hash password
    const hashedpassword = bcrypt.hashSync(newUser.password, salt);
    newUser.password = hashedpassword;
    await newUser.save();
    res.send({ msg: "Utilisateur ajouté" });
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
