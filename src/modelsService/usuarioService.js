const ormPrisma = require("../config/conexion");

// Campos que se pueden devolver (nunca la clave)
const camposPublicos = { id: true, email: true, name: true };

// READ: todos los usuarios
const listarUsuarios = async () => {
    const datos = await ormPrisma.user.findMany({
        select: camposPublicos
    });
    return datos;
};

// READ: un usuario por id (devuelve null si no existe)
const buscarUsuario = async (id) => {
    const usuario = await ormPrisma.user.findUnique({
        where: { id },
        select: camposPublicos
    });
    return usuario;
};

// CREATE
const crearUsuario = async (email, name, clave) => {
    const nuevoUsuario = await ormPrisma.user.create({
        data: { email, name, clave }
    });
    return nuevoUsuario;
};

// UPDATE
const actualizarUsuario = async (id, datos) => {
    const usuario = await ormPrisma.user.update({
        where: { id },
        data: datos,
        select: camposPublicos
    });
    return usuario;
};

// DELETE
const eliminarUsuario = async (id) => {
    const usuario = await ormPrisma.user.delete({
        where: { id },
        select: camposPublicos
    });
    return usuario;
};

module.exports = {
    listarUsuarios,
    buscarUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};
