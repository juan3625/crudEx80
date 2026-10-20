const bcrypt = require("bcryptjs");
const {
    listarUsuarios,
    buscarUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require("../modelsService/usuarioService");

// Convierte el :id de la URL a número. Devuelve null si no es válido.
const leerId = (req) => {
    const id = Number(req.params.id);
    return Number.isInteger(id) && id > 0 ? id : null;
};

// ---------- READ (todos) ----------
const listarController = async (req, res) => {
    try {
        const usuarios = await listarUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

// ---------- READ (uno) ----------
const listarUno = async (req, res) => {
    try {
        const id = leerId(req);
        if (!id) {
            return res.status(400).json({ Error: "El id debe ser un número válido" });
        }

        const usuario = await buscarUsuario(id);
        if (!usuario) {
            return res.status(404).json({ Error: "Usuario no encontrado" });
        }

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
};

// ---------- CREATE ----------
const crear = async (req, res) => {
    try {
        const { email, name, clave } = req.body;

        if (!email || !clave) {
            return res.status(400).json({ Error: "email y clave son obligatorios" });
        }

        // Guardamos la clave encriptada, nunca en texto plano
        const claveHash = await bcrypt.hash(clave, 10);

        const userNew = await crearUsuario(email, name, claveHash);

        // Quitamos la clave antes de responder
        const { clave: _clave, ...usuarioSinClave } = userNew;

        res.status(201).json({ mensaje: "Usuario creado", userNew: usuarioSinClave });
    } catch (error) {
        // P2002 = email repetido (campo @unique)
        if (error.code === "P2002") {
            return res.status(409).json({ Error: "Ese email ya está registrado" });
        }
        res.status(500).json({ Error: error.message });
    }
};

// ---------- UPDATE ----------
const actualizar = async (req, res) => {
    try {
        const id = leerId(req);
        if (!id) {
            return res.status(400).json({ Error: "El id debe ser un número válido" });
        }

        const { email, name, clave } = req.body;

        // Solo actualizamos lo que venga en el body
        const datos = {};
        if (email !== undefined) datos.email = email;
        if (name !== undefined) datos.name = name;
        if (clave !== undefined) datos.clave = await bcrypt.hash(clave, 10);

        if (Object.keys(datos).length === 0) {
            return res.status(400).json({ Error: "Envía al menos un campo: email, name o clave" });
        }

        const usuario = await actualizarUsuario(id, datos);
        res.status(200).json({ mensaje: "Usuario actualizado", usuario });
    } catch (error) {
        // P2025 = no existe ese registro
        if (error.code === "P2025") {
            return res.status(404).json({ Error: "Usuario no encontrado" });
        }
        // P2002 = email repetido
        if (error.code === "P2002") {
            return res.status(409).json({ Error: "Ese email ya está registrado" });
        }
        res.status(500).json({ Error: error.message });
    }
};

// ---------- DELETE ----------
const eliminar = async (req, res) => {
    try {
        const id = leerId(req);
        if (!id) {
            return res.status(400).json({ Error: "El id debe ser un número válido" });
        }

        const usuario = await eliminarUsuario(id);
        res.status(200).json({ mensaje: "Usuario eliminado", usuario });
    } catch (error) {
        // P2025 = no existe ese registro
        if (error.code === "P2025") {
            return res.status(404).json({ Error: "Usuario no encontrado" });
        }
        // P2003 = el usuario tiene posts relacionados
        if (error.code === "P2003") {
            return res.status(409).json({ Error: "No se puede eliminar: el usuario tiene posts asociados" });
        }
        res.status(500).json({ Error: error.message });
    }
};

module.exports = {
    listarController,
    listarUno,
    crear,
    actualizar,
    eliminar
};
