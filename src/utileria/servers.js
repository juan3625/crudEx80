const app = require('./app.js');
const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
    console.log(`servidor corriendo en el puerto http://localhost:${PORT}`);
});