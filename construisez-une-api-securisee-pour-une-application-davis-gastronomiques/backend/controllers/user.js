// le fichier controllers contient les fonctions du fichier routes ! //
// le fichier controllers contient les inscructions du fichier models ! //

// package de cryptage des mdp
const bcrypt = require("bcrypt");
const User = require("../models/User");
//permet de créer et verifier des token
const jwt = require("jsonwebtoken");

// enregistrement des utilisateurs
exports.signup = (req, res, next) => {
  console.log(req.body);
  bcrypt
    // hashage du mdp, on lui passe le password dans, ona plique 10x le hashage
    .hash(req.body.password, 10)
    // on recupere le email dans le body et donne le mdp sous forme de hash ²
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()

        // methode save() dans notre modèle Mongoose enregistre un utilisateur dans notre base de données
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//pour connecter les utilisateur existant
//fonction login permet de savoir si un utilisateur existe dans la base de donnée et si le mdp correpsond à l'utilisateur
exports.login = (req, res, next) => {
  // on apsse l'objet qui sert de selecteur avec un champ email et la valuer donnée par le client
  User.findOne({ email: req.body.email })
    //recupérationd de la valuer et verifier si elle est null
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      } // si on a une valeur
      else {
        bcrypt
          // compare le mdp donnée par le client et ce qui est stocké dans la base de donnée
          .compare(req.body.password, user.password)

          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ error: "Mot de passe incorrect !" });
            }
            res.status(200).json({
              userId: user._id,
              // encode l'id du user/laclé secrette pour l'encodage/ durée de validité
              //our empecher de modifier les objet des autres utilisateurs
              token: jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, {
                expiresIn: "24h",
              }),
            });
          })
          // pas de correspondance entre le mdp client et le mpd dans le server
          .catch((error) => res.status(500).json({ error }));
      }
    })

    .catch((error) => res.status(500).json({ error }));
};
