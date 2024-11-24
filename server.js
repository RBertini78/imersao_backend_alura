import express from "express";
import routes from "./src/routes/postsRoutes.js";

const app = express();
app.use(express.static("uploads"));
routes(app);


app.listen(3000, () => {
    console.log("Servidor escutando...");
});

const posts = [
    { id: 1, descricao: "Foto teste 1", imgURL: "https://placecats.com/millie/300/150" },
    { id: 2, descricao: "Paisagem deslumbrante", imgURL: "https://placecats.com/millie/300/150" },
    { id: 3, descricao: "Cachorro fofo", imgURL: "https://placecats.com/millie/300/150" },
    { id: 4, descricao: "Comida deliciosa", imgURL: "https://placecats.com/millie/300/150" },
    { id: 5, descricao: "Gato curioso", imgURL: "https://placecats.com/millie/300/150" },
    { id: 6, descricao: "Cidade noturna", imgURL: "https://placecats.com/millie/300/150" }
];

function buscaPostPorID(id){
    return posts.findIndex((post) =>{
        return post.id === Number(id);
    });
};

