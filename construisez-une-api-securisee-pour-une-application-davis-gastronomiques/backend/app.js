// creation des applications
const express = require("express");
const bodyParser = require("body-parser");

//facilite les interactions entre application Express et base de données MongoDB.
const mongoose = require("mongoose");

require("dotenv").config();

console.log(process.env.TOKEN_KEY);

// importe routes ici, en bas on va les exporter
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

const path = require("path");

mongoose
  .set("strictQuery", false)
  .connect(
    "mongodb+srv://Atlas1:1234566@cluster0.h003one.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

//xpress prend toutes les requêtes qui ont comme un Content-Type application/json
// et envoi le  body  directement sur l'objet req,
app.use(express.json());
// utilisation de la fonction app
app.use((req, res, next) => {
  // tout le monde peut y acceder avec *
  res.setHeader("Access-Control-Allow-Origin", "*");
  //autorisation d'utiliser certains headers
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  //autorisation d'utiliser certaines requetes
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// avec app.use on les exporte
// url visée par l'application, on note que la fin de l'adresse http
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

// on crée une route, on utilise une fonction express, on récupère le repértoireoù le serv s'execute et y ajouter le répertoire image
// on a ainsi la route complète
app.use("/images", express.static(path.join(__dirname, "images")));

// renvoyée vers le fichier server
module.exports = app;
