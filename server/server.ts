import { Server } from "socket.io";
import { createServer } from "http";
import { Board } from "./board-pieces/board";
import { scoreBoard } from "./board-pieces/scoreBoard";
import { StatusGameDto } from "./status_game/stateGame.dto";

// Crea el servidor HTTP vacío (puede usarse con HTTPS si se agregan certificados)
const httpsServer = createServer({});

// Variables globales para almacenar el tablero, estado del juego y scores
let boardTable: Board = new Board();
let gameStatus: StatusGameDto = new StatusGameDto();
let playerScores: { [key: number]: scoreBoard } = {
  1: new scoreBoard(),
  2: new scoreBoard(),
};

// Inicializa el servidor de Socket.io sobre el servidor HTTP
const server = new Server(httpsServer, {
  cors: {
    origin: "*", // Permite conexiones desde cualquier origen (desarrollo)
  },
});

// Evento de nueva conexión de cliente
server.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Enviar el estado actual al nuevo cliente (incluyendo scores)
  socket.emit("initialScores", playerScores);

  // Evento para guardar el tablero enviado por el cliente
  socket.on("saveCreateBoard", (board, callback) => {
    console.log("Tablero recibido:", board);
    boardTable = board;
    callback(true);
  });

  // Evento para enviar el tablero actual al cliente que lo solicita
  socket.on("getBoard", (callback) => {
    if (boardTable) {
      callback(boardTable);
    } else {
      callback(null);
    }
  });

  // Evento para actualizar y propagar el estado del juego
  socket.on("followGameStatus", (status, callback) => {
    if (status) {
      gameStatus = status;
      server.emit("statusGame", gameStatus);
      callback(true);
    } else {
      callback(null);
    }
  });

  // Nuevos eventos para manejar el scoreboard
  socket.on("updateScores", (player: number, scores: scoreBoard, callback) => {
    if (player === 1 || player === 2) {
      playerScores[player] = scores;

      // Verificar si el juego terminó
      if (scores.gameOver) {
        playerScores[player].gameOver = true;
      }

      // Propagamos los nuevos scores a todos los clientes
      server.emit("scoresUpdated", playerScores);
      callback(true);
    } else {
      callback(false);
    }
  });

  socket.on("getScores", (callback) => {
    callback(playerScores);
  });

  socket.on("resetScores", (callback) => {
    playerScores = {
      1: new scoreBoard(),
      2: new scoreBoard(),
    };
    server.emit("scoresUpdated", playerScores);
    callback(true);
  });

  // Manejo de desconexión
  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Inicia el servidor en el puerto 8181
httpsServer.listen(8181, "0.0.0.0", () => {
  console.log("Servidor Socket.io escuchando en puerto 8181");
});
