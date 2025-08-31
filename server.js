const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// rota de teste
app.get("/", (req, res) => {
  res.send("🔥 Backend do Lek tá on!");
});

// conecta no MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado 🔥"))
  .catch(err => console.error("Erro ao conectar MongoDB:", err));

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
