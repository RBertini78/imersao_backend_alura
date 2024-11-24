import {getTodosPosts, criarPost, atualizarPost} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Importa as funções para obter todos os posts e criar um novo post do módulo postsModel.
// Importa o módulo fs para realizar operações com o sistema de arquivos.

export async function listarPosts(req, res) {
  // Função assíncrona para listar todos os posts.
  // É exportada para ser utilizada em outras partes da aplicação.

  const posts = await getTodosPosts();
  // Chama a função getTodosPosts para obter todos os posts do banco de dados.
  // O resultado é armazenado na constante posts.

  res.status(200).json(posts);
  // Envia uma resposta HTTP com status 200 (sucesso) e o array de posts no formato JSON.
}

export async function novoPost(req, res) {
  // Função assíncrona para criar um novo post.
  // Extrai os dados do novo post do corpo da requisição.

  const newPost = req.body;
  // Obtém os dados do novo post enviados no corpo da requisição.

  try {
    // Bloco try-catch para tratar possíveis erros durante a criação do post.

    const postCriado = await criarPost(newPost);
    // Chama a função criarPost para inserir o novo post no banco de dados.
    // O resultado (o novo post com o ID inserido) é armazenado em postCriado.

    res.status(200).json(postCriado);
    // Envia uma resposta HTTP com status 200 (sucesso) e o post criado como JSON.
  } catch (erro) {
    // Caso ocorra algum erro, entra neste bloco.

    console.error(erro.message);
    // Imprime a mensagem de erro no console para ajudar na depuração.

    res.status(500).json({"Erro":"Falha na requisição"});
    // Envia uma resposta HTTP com status 500 (erro interno do servidor) e uma mensagem de erro.
  }
}

export async function uploadImagem(req, res) {
  // Função assíncrona para criar um novo post com upload de imagem.

  const newPost = {
    descricao: "",
    imgURL: req.file.originalname,
    alt: ""
  }
  // Cria um novo objeto post com os dados recebidos da requisição de upload.

  try {
    // Bloco try-catch para tratar possíveis erros durante a criação do post e o upload da imagem.

    const postCriado = await criarPost(newPost);
    // Cria o post no banco de dados.

    const imagemAtualizada = `uploads/${postCriado.insertedId}.jpg`;
    // Constrói o novo nome do arquivo da imagem, utilizando o ID do post.

    fs.renameSync(req.file.path, imagemAtualizada);
    // Renomeia o arquivo da imagem para o novo nome, movendo-o para a pasta "uploads".

    res.status(200).json(postCriado);
    // Envia uma resposta HTTP com status 200 (sucesso) e o post criado como JSON.
  } catch (erro) {
    // Caso ocorra algum erro, entra neste bloco.

    console.error(erro.message);
    // Imprime a mensagem de erro no console.

    res.status(500).json({"Erro":"Falha na requisição"});
    // Envia uma resposta HTTP com status 500 (erro interno do servidor) e uma mensagem de erro.
  }
}

export async function atualizarNovoPost(req, res) {
  // Função assíncrona para criar um novo post.
  // Extrai os dados do novo post do corpo da requisição.

  const id = req.params.id;// Obtém os dados do novo post enviados no corpo da requisição.
  const urlImagem = `http://localhost:3000/${id}.jpg`;
  
  try {
    // Bloco try-catch para tratar possíveis erros durante a criação do post.
    const imgBuffer = fs.readFileSync(`uploads/${id}.jpg`);
    const descricao = await gerarDescricaoComGemini(imgBuffer);

    const post = {
      imgURL: urlImagem,
      descricao: descricao,
      alt: req.body.alt
    }

    const postCriado = await atualizarPost(id, post);
    // Chama a função criarPost para inserir o novo post no banco de dados.
    // O resultado (o novo post com o ID inserido) é armazenado em postCriado.

    res.status(200).json(postCriado);
    // Envia uma resposta HTTP com status 200 (sucesso) e o post criado como JSON.
  } catch (erro) {
    // Caso ocorra algum erro, entra neste bloco.

    console.error(erro.message);
    // Imprime a mensagem de erro no console para ajudar na depuração.

    res.status(500).json({"Erro":"Falha na requisição"});
    // Envia uma resposta HTTP com status 500 (erro interno do servidor) e uma mensagem de erro.
  }
}