const express = require("express");
const {
    listarController,
    listarUno,
    crear,
    actualizar,
    eliminar
} = require("../controllers/usuariosController");

const router = express.Router();


router.get("/listado", listarController);   
router.post("/crear", crear);              

router.get("/:id", listarUno);              
router.put("/:id", actualizar);             
router.delete("/:id", eliminar);            

module.exports = router;
