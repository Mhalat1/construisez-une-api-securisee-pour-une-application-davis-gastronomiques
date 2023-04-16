// le fichier controllers contient les fonctions du fichier routes ! //
// le fichier controllers contient les inscructions du fichier models ! //

const Sauces = require("../models/Sauces");
//Le package fs permet d'interagir avec le système de fichiers du serveur.
const fs = require("fs");

exports.createSauces = (req, res, next) => {
  // parser pour envoyer en chaine de caractère
  const saucesObject = JSON.parse(req.body.sauce);
  // car id générée automatiquement par la base de donnée
  delete saucesObject._id;
  // empêche l'authenitifxation avec un id donnée par le client
  delete saucesObject._userId;
  const sauces = new Sauces({
    //L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de saucesObject qui est dessus
    ...saucesObject,
    // id recupérée quand le fichier auth
    userId: req.auth.userId,
    // on crée l'url de l'image
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  // operateur ternaire : condition ? exprSiVrai : exprSiFaux
  // operateur spreed : const copie = ...originale;

  sauces
    .save()
    // methode save() dans notre modèle Mongoose enregistre une sauce dans notre base de données
    // succès then
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    // échec catch
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOneSauces = (req, res, next) => {
  Sauces.findOne({
    _id: req.params.id,
  })

    // methode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant toutes les sauces dans notre base de données
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifySauces = (req, res, next) => {
  // on regarde s'il y'a un champ file
  // oparateur ternaire ici
  const saucesObject = req.file
    ? {
        // si oui
        //L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de JSON.parse(req.body.sauces)
        // operateur spread
        ...JSON.parse(req.body.sauces),
        // on recrée l'url de l'image
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : //L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
      // si non on récupre l'objet dans le corp de la requête
      { ...req.body };
  // suprime user id vennant du client c'est une mesure de securité
  delete saucesObject._userId;
  // on cherche dans notre base de donnée, pour vérifier si c'est bien l'utilisateur à qui appartient cet objet qui cherche à le modifier
  // methode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant toutes les sauces dans notre base de données
  Sauces.findOne({ _id: req.params.id })
    // si oui
    .then((sauces) => {
      // si le champ userId recupérée est different de l'user id qui vient d enotre token alors la modification vient de qqun à qui l'objet n'appartient pas
      if (sauces.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      }
      // si non c'est le bon utilisateur alors on met à jour l'enregistrement
      else {
        Sauces.updateOne(
          // on donne quel objet est à mettre à jour
          { _id: req.params.id },
          // ce qu'on a recupéré dans le body de notre fonction avec l'id qui vient de sparamètres de l'url
          { ...saucesObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauces = (req, res, next) =>
  // on récupere l'objet
  Sauces.findOne({ _id: req.params.id })
    //succès
    .then((sauces) => {
      // vérifie s ic'est le proprio de l'objet qui demande la suppresion
      if (sauces.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
        // si bon utilisateru suppresion de l'objet suppression de li'mage du système de fichier
      } else {
        // récuperation du nom de fichier avec le slit
        const filename = sauces.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          // supprime l'enregistrmeent dans la base de donnée qui est dans req.params.id
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    //erreur
    .catch((error) => {
      res.status(500).json({ error });
    });

exports.getAllSauces = (req, res, next) => {
  Sauces.find()
    // methode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant
    // toutes les sauces dans notre base de données
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
};

exports.likeSauce = (req, res, next) => {
  // on donne quel objet est à mettre à jour
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (req.body.like === 1) {
        if (sauce.usersLiked.includes(req.auth.userId)) {
          res.status(401).json({ error: "Sauce already liked" });
        } else {
          // met à jour Sauces dans la base de donnée
          Sauces.updateOne(
            // on donne quel objet est à mettre à jour
            { _id: req.params.id },
            {
              // l'operateur inc sert à incrementer en donnant pour argument l'origine et la methode
              // la fonction inc est utilisé ici pour ajouter élement like en plus
              $inc: { likes: req.body.like++ },
              // après on push l'id dans usersLiked
              $push: { usersLiked: req.auth.userId },
            }
          )
            .then((sauce) => res.status(200).json({ message: "Like add" }))
            .catch((error) => res.status(400).json({ error }));
        }
      } else if (req.body.like === -1) {
        if (sauce.usersDisliked.includes(req.auth.userId)) {
          res.status(401).json({ error: "Sauce already disliked" });
        } else {
          // met à jour Sauces dans la base de donnée
          Sauces.updateOne(
            // on donne quel objet est à mettre à jour
            { _id: req.params.id },
            {
              // l'operateur inc sert à incrementer en donnant pour argument l'origine et la methode
              // la fonction inc est utilisé ici pour ajouter élement like en plus
              $inc: { dislikes: req.body.like++ * -1 },
              // après on push l'id dans usersLiked
              $push: { usersDisliked: req.auth.userId },
            }
          )
            .then((sauce) => res.status(200).json({ message: "Dislike add" }))
            .catch((error) => res.status(400).json({ error }));
        }
      } else {
        // si on est dans un cas où on a dejà liké au disliké, on, le sait grace à l'id qui suit les like et dislike
        if (sauce.usersLiked.includes(req.auth.userId)) {
          // met à jour Sauces dans la base de donnée
          Sauces.updateOne(
            { _id: req.params.id },
            // l'element pull est utilisé pour supprimer un élement
            { $pull: { usersLiked: req.auth.userId }, $inc: { likes: -1 } }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Like deleted" });
            })
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.auth.userId)) {
          // met à jour Sauces dans la base de donnée
          Sauces.updateOne(
            { _id: req.params.id },
            {
              // l'element pull est utilisé pour supprimer un élement
              $pull: { usersDisliked: req.auth.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Dislike deleted" });
            })
            .catch((error) => res.status(400).json({ error }));
        }
      }
    })
    .catch((error) => res.status(400).json({ error }));
};
