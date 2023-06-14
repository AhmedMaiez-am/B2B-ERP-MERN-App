const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRequest = require("../models/UserRequest");
const User = require("../models/User");
const httpntlm = require("httpntlm");
const nodemailer = require("nodemailer");
const salt = bcrypt.genSaltSync(10);

//ajout demande
router.post("/addUser", async (req, res, next) => {
  try {
    const newUser = new UserRequest({
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
  } catch (error) {
    console.log(error);
  }
});

// Get all user requests
router.get("/userRequests", async (req, res, next) => {
  try {
    const userRequests = await UserRequest.find();
    res.json(userRequests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//valider user
router.post("/validate", async (req, res, next) => {
  try {
    const { data } = req.body;
    const firstUser = data[0];
    const newUser = new User({
      no: firstUser.no,
      name: firstUser.name,
      email: firstUser.email,
      password: firstUser.password,
      tel: firstUser.tel,
      address: firstUser.address,
      genBusGroup: firstUser.genBusGroup,
      customerGroup: firstUser.customerGroup,
      code_magasin: firstUser.code_magasin,
      codeLivraison: firstUser.codeLivraison,
      codeTVA: firstUser.codeTVA,
      paymentTerm: firstUser.paymentTerm,
      paymentCode: firstUser.paymentCode,
    });
    // Hash password
    const hashedpassword = bcrypt.hashSync(newUser.password, salt);
    newUser.password = hashedpassword;
    await newUser.save();
    // Delete the user from UserRequest
    await UserRequest.findByIdAndDelete(firstUser._id);
    try {
      //insert new client to business central
      const BC_user = {
        No: newUser.no,
        Name: newUser.name,
        Address: newUser.address,
        Phone_No: newUser.tel,
        E_Mail: newUser.email,
        Gen_Bus_Posting_Group: newUser.genBusGroup,
        Customer_Posting_Group: newUser.customerGroup,
        Location_Code: newUser.code_magasin,
        Shipment_Method_Code: newUser.codeLivraison,
        VAT_Bus_Posting_Group: newUser.codeTVA,
        Payment_Terms_Code: newUser.paymentTerm,
        Payment_Method_Code: newUser.paymentCode,
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

// Delete request
router.delete("/delete", async (req, res, next) => {
  try {
    const userData = req.body;
    const userId = userData[0]._id;
    // Delete user from User collection
    await UserRequest.findByIdAndDelete(userId);
    res.send("User deleted successfully from User request collection");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user");
  }
});


module.exports = router;
