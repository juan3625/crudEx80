const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { buscarPorEmail, crearUsuario } = require("../models/usuariosModel");

const registrar = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ mensaje: "nombre, email y password son obligatorios" });
        }

        if (buscarPorEmail(email)) {
            return res.status(409).json({ mensaje: "Ese email ya está registrado" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const nuevo = crearUsuario({ nombre, email, password: passwordHash });

        res.status(201).json({
            mensaje: "Usuario registrado",
            usuario: { id: nuevo.id, nombre: nuevo.nombre, email: nuevo.email }
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al registrar", detalle: error.message });
    }
};

const iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = buscarPorEmail(email);
        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            return res.status(400).json({ mensaje: "Email o contraseña incorrectos" });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al iniciar sesión", detalle: error.message });
    }
};

module.exports = { registrar, iniciarSesion };