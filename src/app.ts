// Importa a biblioteca Express e também o tipo Express
// O Express será utilizado para criar o servidor web
import express from "express";
import type { Express, Request, Response } from "express";

import fs from "fs";

//importa a classe Player do arquivo Player.ts
import { Player } from "./models/Player.js";


// Cria uma aplicação Express
// A função express() devolve um objeto que representa o servidor da aplicação
const app: Express = express();

// Middleware para permitir que o servidor aceite requisições com corpo em formato JSON
app.use(express.json());

// Define a porta onde o servidor ficará disponível
// Neste caso, o servidor poderá ser acessado pela porta 8081
const PORT: number = 8081;

// Define o nome do diretório onde os arquivos serão armazenados
const DATA_FILE = "/data/players.json";

/*
Função para garantir que o diretório de dados exista antes de salvar os arquivos.
Se o diretório não existir, ele será criado.
*/
function ensureDataFolderExists() {
  const dataFolder = "/data";
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
  }
}

// Chamar a função para garantir que o diretório de dados exista
// Antes de qualquer operação de leitura ou escrita de arquivos
ensureDataFolderExists();

// Função para salvar os dados do jogador em um arquivo JSON
function savePlayerState(player: Player) {
  // Converte o objeto player em uma string JSON
  const data = JSON.stringify(player, null, 2);
  // Salva a string JSON em um arquivo chamado "player.json" dentro do diretório de dados
  fs.writeFileSync (DATA_FILE, data, "utf-8");
}

// Função para carregar os dados do jogador a partir de um arquivo JSON
function LoadPlayesState(): Player {
  // Verifica se o arquivo de dados existe
  if (fs.existsSync(DATA_FILE)) {
    // Lê o conteúdo do arquivo e converte de volta para um objeto Player
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const playerData = JSON.parse(data);
    
    /* ATENÇÃO: JSON.parse() retorna um objeto "puro" 
    (sem os métodos da classe Player)
    Para que o objeto tenha os métodos da classe Player, precisamos criar
    uma nova instância da classe Player e passar os dados carregadas para o construtor da classe.
    */
    return new Player(playerData.name, playerData.health, playerData.level);
  }
  // Criar um novo player se não existir com nome "Jogador1" com 100 de saúde e nível 1
  const newPlayer = new Player("Jogador1", 100, 1);
  savePlayerState(newPlayer);
  return newPlayer;
}
// Inicializa o pãyer carregando seu estado de arquivo JSON
let player1 : Player = LoadPlayesState();

// Rota GET para obter informações do jogador
// Quando o cliente fizer uma requisição GET para a rota "/player", o servidor responderá com os dados do jogador
// A função de callback recebe dois parâmetros: req (requisição) e res (resposta)
app.get("/player", (req: Request, res: Response) => {
  res.json({
    message: "Informações do jogador",
    player:player1,
  }); 
});
//rota POST para atacar o jogador
// Quando o cliente fizer uma requisição POST para a rota "/player/attack", o servidor chamará o método attack() do jogador
// do jogador
// É ultilizafa para enviar dados para o servidor, nesse caso, o ataque do jogador
// como neste case, onde o jogador realiza uma ação (como acionar um comportamento de ataque)
// que é o metodo attack() do Jogador.
// A função de callback recebe dois parâmetros: req (requisição) e res (resposta)
app.post("/player/attack", (req: Request, res: Response) => {
  const attackMessage = player1.attack(); //chama o método attack() do jogador
  // Retorna uma resposta JSON com a mensagem de ataque
  // para o cliente que fez a requisição
  res.json({
    message: attackMessage,
  });
});

// Rota para receber o dano 
// Quando o usúario acessar a rota "/player/take-damage" com uma requisição POST, o servidor chamará o método takeDamage() do jogador
// método takeDamage() do jogador, pasando o valor do dano recebido no corpo da requisição (req.body.amount).
//parâmetro
app.post("/player/take-damage", (req: Request, res: Response) => {
  const { damage } = req.body;
  const damageMessage = player1.takeDamage(damage);
  // Salvar o estado atuao do player no arquivo JSON
  savePlayerState(player1);
  res.json({
    // Retorna a mensagem do dano recebido
    action: damageMessage,
    // Retorna o valor da saúde atual do jogador
    currentHealth: player1.health,
    // Retorna o nível atual do jogador
    currentLevel: player1.level,
  });
});

// Rota para adicionar saúde ao jogador
// Quando o usúario acessar a rota "/take_Health" com uma requisição POST, o servidor adicionará a quantidade de saúde recebida no corpo da requisição (req.body.health) ao jogador
// método takeDamage() do jogador, pasando o valor do dano recebido no corpo da requisição (req.body.amount).
app.post("/player/take_Health", (req: Request, res: Response) => {
  const { health } = req.body;
  player1.health += health;
  savePlayerState(player1);
  res.json({
    // Retorna a mensagem de saúde adicionada com sucesso
    message: "Saúde adicionada com sucesso!",
    // retorna o valor da saúde atual do jogador
    currentHealth: player1.health
  });
});

// Rota para aumentar o nível do jogador
// Quando o usúario acessar a rota "/level_up" com uma requisição POST, o servidor aumentará o nível do jogador em 1
// método takeDamage() do jogador, pasando o valor do dano recebido no corpo da requisição (req.body.amount).
app.post("/player/level_up", (req: Request, res: Response) => {
  player1.level += 1;
  savePlayerState(player1);
  res.json({
    // Retorna a mensagem de nível aumentado com sucesso
    message: "Nível aumentado com sucesso!",
    currentLevel: player1.level
  });
});

// Inicializa o servidor utilizando a porta definida
// O método listen() faz o servidor começar a "escutar" requisições HTTP
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("Rotas disponiveis:");
  console.log(`GET http://localhost:${PORT}/player - Obter informações do jogador`);
  console.log(`POST http://localhost:${PORT}/player/attack - Jogador realiza ataque`);
  console.log(`POST http://localhost:${PORT}/player/take-damage - Jogador recebe dano`);
  console.log(`POST http://localhost:${PORT}/player/take_Health - Adicionar saúde ao jogador`);
  console.log(`POST http://localhost:${PORT}/player/level_up - Aumentar nível do jogador`);
});
