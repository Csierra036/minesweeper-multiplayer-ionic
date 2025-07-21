import { Server } from "socket.io";
import { createServer } from "http";
import { Board } from "./board-pieces/board";
import { scoreBoard } from "./board-pieces/scoreBoard";
import { StatusGameDto } from "./status_game/stateGame.dto";


const httpsServer = createServer({});

let boardTable: Board = new Board();
let gameStatus: StatusGameDto = new StatusGameDto();
let gameStarted: boolean = false;
let playerScores: { [key: number]: scoreBoard } = {
  1: new scoreBoard(),
  2: new scoreBoard(),
};


const server = new Server(httpsServer, {
  cors: {
    origin: "*",
  },
});


server.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);


  socket.emit("initialScores", playerScores);

  
  socket.on("saveCreateBoard", (board, callback) => {
    console.log("Tablero recibido:", board);
    boardTable = board;
    callback(true);
  });

  
  socket.on("getBoard", (callback) => {
    if (boardTable) {
      callback(boardTable);
    } else {
      callback(null);
    }
  });


  socket.on("checkStartedGame", (callback) => {
    callback(gameStarted);
  });


  socket.on("saveStartedGame", (status, callback) => {
    gameStarted = status;
    callback(true);
  });

  
  socket.on("followGameStatus", (status, callback) => {
    if (status) {
      gameStatus = status;
      server.emit("statusGame", gameStatus);
      callback(true);
    } else {
      callback(null);
    }
  });

  
  socket.on("updateScores", (player: number, scores: scoreBoard, callback) => {
    if (player === 1 || player === 2) {
      playerScores[player] = scores;

      
      if (scores.gameOver) {
        playerScores[player].gameOver = true;
      }

      
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

  
  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});


httpsServer.listen(8181, "0.0.0.0", () => {
  console.log("Servidor Socket.io escuchando en puerto 8181");
});
