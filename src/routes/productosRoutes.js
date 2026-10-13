const { Router } = require('express');
const { listarProductos,listarUnProducto, crearProducto, 
eliminarProducto } = require('../controllers/productosController.js')

const router = Router();

//ruta final complementaria para dormar /api/listar/productos
router.get('/listado', listarProductos);
router.get('/listarUno', listarUnProducto);
router.get('/crear', crearProducto);
router.get('/eliminar', eliminarProducto)

module.exports = router;