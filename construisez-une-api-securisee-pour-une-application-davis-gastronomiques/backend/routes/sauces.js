// le fichier routes est utilisée pour mettre en place les methodes CORP en suivant les methodes dans controllers

const express = require("express");
const router = express.Router();
// importation auth depuis middlewar
const auth = require("../middlewar/auth");
const multer = require("../middlewar/multer-config");
const saucesCtrl = require("../controllers/sauces");

// les logiques sont dans le dossier controllers ! //

// on enregistretout les corp dans le routeur

router.post("/", auth, multer, saucesCtrl.createSauces);
router.put("/:id", auth, multer, saucesCtrl.modifySauces);

router.post("/:id/like", auth, saucesCtrl.likeSauce);
router.delete("/:id", auth, saucesCtrl.deleteSauces);
router.get("/:id", auth, saucesCtrl.getOneSauces);
router.get("/", auth, saucesCtrl.getAllSauces);

// one xporte le routeur, récupéré dans le app.js
module.exports = router;

// les fonctions sont dans le fichier controllers
// createSauces etc
