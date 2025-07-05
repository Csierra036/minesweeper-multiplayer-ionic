import { Server } from "socket.io";
import { createServer } from "http";
import { Board } from "./board-pieces/board";
import { StatusGameDto } from "./status_game/stateGame.dto";
const httpsServer = createServer({});
let boardTable: Board = new Board();
let statusGame: StatusGameDto = new StatusGameDto();


const server = new Server(httpsServer, {
  cors: {
    origin: "*",
  },
});


server.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);
  

  socket.on("saveCreateBoard", (board, callback) => {
    console.log("Tablero recibido:", board);
    boardTable = board;
    console.log("Tablero guardado en el servidor:", boardTable);
    callback(true);
  });


  socket.on("getBoard", (callback) => {
    if (boardTable) {
      console.log("Enviando tablero al cliente:", boardTable);
      callback(boardTable);

    } else {
      console.log("No hay tablero disponible");
      callback(null);
    }
  });


  socket.on("followGameStatus", (statusGame, callback) =>{
    if (statusGame) {
      console.log("Enviado estado de juego a clientes:", boardTable);
      server.emit("statusGame", statusGame);

    } else {
      console.log("No hay tablero disponible");
      callback(null);
    }
  })
});


httpsServer.listen(8181, "0.0.0.0", () => {
  console.log("Servidor HTTPS Socket.io escuchando en puerto 8181");
});
