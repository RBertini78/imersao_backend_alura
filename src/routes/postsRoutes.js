import express from "express"; // Importa o framework Express para criar aplicações web
import multer from "multer"; // Importa o middleware Multer para lidar com uploads de arquivos
import cors from "cors";
import { listarPosts, novoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js"; // Importa funções controladoras para lidar com requisições relacionadas a posts
import { criarPost } from "../models/postsModel.js"; // Importa a função para criar um novo post (opcional)

const corsOptions = {
  origin: "http://localhost:8000",
  optionSuccessStatus: 200
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) { // Define o diretório de destino para os arquivos
      cb(null, 'uploads/'); // Armazena os arquivos enviados na pasta 'uploads/'
    },
    filename: function (req, file, cb) { // Define o nome do arquivo enviado
      cb(null, file.originalname); // Utiliza o nome original do arquivo por simplicidade
    }
  });
  
  const upload = multer({ dest: "./uploads", storage }); // Cria uma instância do Multer com a configuração de armazenamento

  const routes = (app) => { // Função para definir as rotas da aplicação

    // Middleware: Analisa corpos de requisições JSON
    app.use(express.json());
    app.use(cors(corsOptions));
  
    // Rota raiz para uma mensagem de boas-vindas
    app.get("/", (req, res) => {
      res.status(200).send("Bem vindo à imersão!"); // Envia uma mensagem de boas-vindas
    });
  
    // Rota para obter uma lista de todos os posts
    app.get("/posts", listarPosts); // Delega o tratamento para a função controladora listarPosts
  
    // Rota para obter um post específico por ID (assumindo implementação de buscaPostPorID)
    app.get("/posts/:id", (req, res) => {
      const { id } = req.params; // Extrai o parâmetro ID da requisição
      const index = buscaPostPorID(id); // Utiliza a função buscaPostPorID para encontrar o post (implementação necessária)
      if (index !== undefined) { // Verifica se o post foi encontrado
        res.status(200).json(posts[index]); // Envia os dados do post se encontrado
      } else {
        res.status(404).send("Post não encontrado"); // Envia um erro se não encontrado
      }
    });
  
    // Rota para criar um novo post (assumindo implementação da função controladora novoPost)
    app.post("/posts", novoPost); // Delega o tratamento para a função controladora novoPost
  
    // Rota para fazer upload de uma imagem e criar um novo post
    app.post("/upload", upload.single("imagem"), uploadImagem); // Utiliza o Multer para upload de uma única imagem e delega o tratamento para a função controladora 
    
    app.put("/upload/:id", atualizarNovoPost);
  
    // (Opcional) Middleware para tratar erros: Captura erros não tratados
    app.use((err, req, res, next) => {
      console.error(err.stack); // Registra os erros no console
      res.status(500).send("Erro interno do servidor"); // Envia uma resposta genérica de erro
    });
  };
  
  export default routes;