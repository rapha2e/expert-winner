const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// habilita CORS (permite que o front se conecte ao backend)
app.use(cors());
app.use(express.json());

// rota de teste
app.get("/", (req, res) => {
  res.send("🔥 Backend do Lek tá on!");
});

// conecta no MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB conectado 🔥"))
  .catch(err => console.error("Erro ao conectar MongoDB:", err));

// sobe servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

// ====== MODELO CLIENTE ======
const clienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now }
});

const Cliente = mongoose.model("Cliente", clienteSchema);

// ====== ROTAS ======

// Criar novo cliente (POST)
app.post("/clientes", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).send({ erro: "Preencha todos os campos!" });
    }
    const novoCliente = new Cliente({ nome, email, senha });
    await novoCliente.save();
    res.status(201).send(novoCliente);
  } catch (err) {
    console.error("Erro ao salvar cliente:", err);
    res.status(400).send({ erro: "Erro ao salvar cliente", detalhe: err });
  }
});

// Listar clientes (GET)
app.get("/clientes", async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.send(clientes);
  } catch (err) {
    console.error("Erro ao buscar clientes:", err);
    res.status(500).send({ erro: "Erro ao buscar clientes", detalhe: err });
  }
});

// Login (POST)
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const cliente = await Cliente.findOne({ email, senha });
    if (!cliente) {
      return res.status(401).send({ erro: "Credenciais inválidas" });
    }
    res.send({ mensagem: "Login bem-sucedido 🔑", cliente });
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    res.status(500).send({ erro: "Erro ao fazer login", detalhe: err });
  }
});
