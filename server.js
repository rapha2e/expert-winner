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

// ====== MODELO CLIENTE ======
const clienteSchema = new mongoose.Schema({
  nome: String,
  email: String,
  criadoEm: { type: Date, default: Date.now }
});

const Cliente = mongoose.model("Cliente", clienteSchema);

// ====== ROTAS ======

// Criar novo cliente (POST)
app.post("/clientes", async (req, res) => {
  try {
    const novoCliente = new Cliente(req.body);
    await novoCliente.save();
    res.status(201).send(novoCliente);
  } catch (err) {
    res.status(400).send({ erro: "Erro ao salvar cliente", detalhe: err });
  }
});

// Listar clientes (GET)
app.get("/clientes", async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.send(clientes);
  } catch (err) {
    res.status(500).send({ erro: "Erro ao buscar clientes", detalhe: err });
  }
});
