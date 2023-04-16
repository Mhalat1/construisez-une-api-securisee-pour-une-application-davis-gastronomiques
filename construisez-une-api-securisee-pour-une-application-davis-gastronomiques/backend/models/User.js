// le fichier models renvoi les isntructions vers le fichier controllers ! //

// on utilise mongoose pour créer les modeles
const mongoose = require("mongoose");
// ça empêche d'avoir plusieurs utilisateur avec un même email
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// on appplique le module uniqueVlidator sur le userSchema
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
