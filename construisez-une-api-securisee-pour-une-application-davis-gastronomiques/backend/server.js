//importation de packages de nodes
const http = require("http");
// imporation des application dans le fichier app.js
const app = require("./app");

// on dit quel port on va choisir
app.set("port", process.env.PORT || 3000);
//usage du paquet http dans le fichier app.js
const server = http.createServer(app);
//le serveur écoute le port 3000 ou autre port si 3000 indispo on écoute le port par défaut
server.listen(process.env.PORT || 3000);
