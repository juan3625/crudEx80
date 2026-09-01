//importacion del paquete de express, sistema moderno (import)
import miExpress from "express"
import "dotenv/config"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

//obtener __dirname equivalente en ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//creacion de mi aplicacion de express
const miApp = miExpress()
const miPuerto = process.env.MIPUERTO || 3333

//middleware para poder leer JSON en el body de las peticiones
miApp.use(miExpress.json())

//ruta del archivo que simula nuestra base de datos
const rutaDatos = path.join(__dirname, "datosProductos.json")

//funcion auxiliar para leer los productos del archivo
function leerProductos() {
    const contenido = fs.readFileSync(rutaDatos, "utf-8")
    return JSON.parse(contenido)
}

//funcion auxiliar para guardar los productos en el archivo
function guardarProductos(productos) {
    fs.writeFileSync(rutaDatos, JSON.stringify(productos, null, 2))
}

//endpoint raiz, no tiene ruta
miApp.get("/", (req, res) => { res.send(`<h1>Api Rest Productos la 80</h1>`) })

//GET /api/productos -> listar todos los productos
miApp.get("/api/productos", (req, res) => {
    const productos = leerProductos()
    res.json(productos)
})

//GET /api/productos/:id -> obtener un producto por su id
miApp.get("/api/productos/:id", (req, res) => {
    const productos = leerProductos()
    const producto = productos.find(p => p.id === Number(req.params.id))

    if (!producto) {
        return res.status(404).json({ mensaje: "Producto no encontrado" })
    }

    res.json(producto)
})

//POST /api/productos -> crear un producto nuevo
miApp.post("/api/productos", (req, res) => {
    const { nombre, precio, stock, categoria } = req.body

    if (!nombre || precio === undefined || stock === undefined || !categoria) {
        return res.status(400).json({ mensaje: "Bad Request: nombre, precio, stock y categoria son obligatorios" })
    }

    const productos = leerProductos()

    const nuevoId = productos.length > 0
        ? Math.max(...productos.map(p => p.id)) + 1
        : 1

    const nuevoProducto = {
        id: nuevoId,
        nombre,
        precio,
        stock,
        categoria,
        imagen: "sin imagen"
    }

    productos.push(nuevoProducto)
    guardarProductos(productos)

    res.status(201).json(nuevoProducto)
})

//PUT /api/productos/:id -> actualizar un producto existente
miApp.put("/api/productos/:id", (req, res) => {
    const { nombre, precio, stock, categoria } = req.body

    if (!nombre || precio === undefined || stock === undefined || !categoria) {
        return res.status(400).json({ mensaje: "Bad Request: nombre, precio, stock y categoria son obligatorios" })
    }

    const productos = leerProductos()
    const indice = productos.findIndex(p => p.id === Number(req.params.id))

    if (indice === -1) {
        return res.status(404).json({ mensaje: "Producto no encontrado" })
    }

    productos[indice] = {
        ...productos[indice],
        nombre,
        precio,
        stock,
        categoria
    }

    guardarProductos(productos)
    res.json(productos[indice])
})

//DELETE /api/productos/:id -> eliminar un producto por id
miApp.delete("/api/productos/:id", (req, res) => {
    const productos = leerProductos()
    const indice = productos.findIndex(p => p.id === Number(req.params.id))

    if (indice === -1) {
        return res.status(404).json({ mensaje: "Producto no encontrado" })
    }

    const eliminado = productos.splice(indice, 1)
    guardarProductos(productos)

    res.json({ mensaje: "Producto eliminado", producto: eliminado[0] })
})

//link del servidor, por donde se escucha las peticiones del usuario.
miApp.listen(miPuerto, () => {
    console.log(`SERVIDOR: http://localhost:${miPuerto}`)
})
