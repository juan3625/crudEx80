const express = require('express');
const Router = require('../routes/index.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", Router);

app.get("/", (req, res) => {
    res.send("API funcionando");
});

module.exports = app;