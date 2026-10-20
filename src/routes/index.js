//consolida todos los enrutadores
const { Router } = require("express");
const usuariosRouter = require("./usuariosRoutes");
const productosRouter = require ("./productosRoutes")
const enrutador = Router();

//enrutador
enrutador.use("/usuarios", usuariosRouter);
enrutador.use("/productos", productosRouter)

module.exports = enrutador;