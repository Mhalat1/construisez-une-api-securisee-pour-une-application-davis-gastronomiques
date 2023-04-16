//multer  sert à savoir comment enregistrer et que nom donner aux fichier //
const multer = require("multer");

// on crée notre dictionnaire
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

// on enregistre sur le diskStorage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // null signifie qu'il n y  pas eu d'érreur et prend le dossier images comme argument
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // genere le nouveau npom, en utilisation le nom d'origine du l'image,, elimine les espace avec split, et le sremplace par des _
    const name = file.originalname.split(" ").join("_");
    // l'lement du dictionnaire qui correspond au minetype du fichier envoyé par le frontned
    const extension = MIME_TYPES[file.mimetype];
    //on appel le callback
    // null donc pas d'erreur, on crée le filename ce sera le name qu'on a au dessus, date.now donne une mise à jour de la
    // donnée au miliseconde prés, et en final on a l'extension du fichier
    callback(null, name + Date.now() + "." + extension);
  },
});
// on appel la methode molter et on lui passe l'objet storage et on appel single pour dire qu'il s'agit d'un
//fichier unique et qu'il s'agit de fichier image
module.exports = multer({ storage: storage }).single("image");

// on ajoute le multer dans les dossier routers
