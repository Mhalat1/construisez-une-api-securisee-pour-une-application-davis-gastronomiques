const jwt = require("jsonwebtoken");

// exporation de la fonction middlewar
module.exports = (req, res, next) => {
  try {
    //recuperer le token, récupere le header, splier signifie séparer
    //la chaine de caractère en un tableau, on récupère le token qui est en position 2 du tableau
    const token = req.headers.authorization.split(" ")[1];
    //on décode le token une fois qu'on la récupéré
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    // récuperer l'user id en particulier
    const userId = decodedToken.userId;
    // ajoute l'id à req, on crée l'objet auth dedans avec userId dedans
    req.auth = {
      userId: userId,
    };
    console.log(req.auth.userId);
    next();
    //retour en cas d'erreur
  } catch (error) {
    res.status(401).json({ error });
  }
};

// c'est renvoyé dans le fichier routes !
