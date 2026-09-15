// importar libreria
const jwtoken = require("jsonwebtoken");

// funcion middleware
const autenticacionToken = (req, res, next) => {
    // Soporta 'authorization' o el header personalizado 'authent'
    const authHeader = req.header("authorization") || req.header("authent");

    if (!authHeader) {
        return res.status(401).json({ mensaje: "Acceso denegado, no provee un token." });
    }

    // Separar 'Bearer <token>'
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ mensaje: "Acceso denegado, formato de token inválido." });
    }

    // verificar token
    jwtoken.verify(token, process.env.JWT_SECRET, (error, usuario) => {
        if (error) {
            return res.status(403).json({ mensaje: "Token inválido" });
        }

        req.aprendiz = usuario;
        next();
    });
};

module.exports = autenticacionToken;