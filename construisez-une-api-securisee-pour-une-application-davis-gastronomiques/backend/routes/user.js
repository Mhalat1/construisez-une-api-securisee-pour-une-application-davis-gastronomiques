// le fichier routes est utilisée pour mettre en place les methodes CORP en suivant les methodes dans controllers

const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

// les logiques sont dans le dossier controllers ! //

// on enregistretout les corp dans le routeur
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

// one xporte le routeur, récupéré dans le app.js
module.exports = router;
