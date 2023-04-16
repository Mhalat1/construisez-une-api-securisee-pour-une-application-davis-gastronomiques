// le fichier models renvoi les isntructions vers le fichier controllers ! //

// on utilise mongoose pour créer les modeles
const mongoose = require("mongoose");

//    La méthode  Schema  de Mongoose vous permet de créer un schéma de données pour votre base de données MongoDB.
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String },
  heat: { type: Number },
  likes: { default: 0, type: Number },
  dislikes: { default: 0, type: Number },
  userId: { type: String },
  usersLiked: [String],
  usersDisliked: [String],
});

// exportation du model
//La méthode  model  transforme ce modèle en un modèle utilisable.
module.exports = mongoose.model("Sauce", sauceSchema);
