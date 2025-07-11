import { Server } from "socket.io";
import { createServer } from "http";
import { Board } from "./board-pieces/board";
import { StatusGameDto } from "./status_game/stateGame.dto";

// Crea el servidor HTTP vacío (puede usarse con HTTPS si se agregan certificados)
const httpsServer = createServer({});

// Variables globales para almacenar el tablero y el estado del juego
let boardTable: Board = new Board();
let gameStatus: StatusGameDto = new StatusGameDto();

// Inicializa el servidor de Socket.io sobre el servidor HTTP
const server = new Server(httpsServer, {
  cors: {
    origin: "*", // Permite conexiones desde cualquier origen (desarrollo)
  },
});

// Evento de nueva conexión de cliente
server.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Evento para guardar el tablero enviado por el cliente
  socket.on("saveCreateBoard", (board, callback) => {
    console.log("Tablero recibido:", board);
    boardTable = board; // Guarda el tablero recibido
    console.log("Tablero guardado en el servidor:", boardTable);
    callback(true); // Confirma al cliente que se guardó correctamente
  });

  // Evento para enviar el tablero actual al cliente que lo solicita
  socket.on("getBoard", (callback) => {
    if (boardTable) {
      console.log("Enviando tablero al cliente:", boardTable);
      callback(boardTable); // Envía el tablero actual
    } else {
      console.log("No hay tablero disponible");
      callback(null); // Indica que no hay tablero
    }
  });

  // Evento para actualizar y propagar el estado del juego a todos los clientes
  socket.on("followGameStatus", (status, callback) => {
    if (status) {
      gameStatus = status; // Actualiza el estado global
      console.log("Enviado estado de juego a clientes:", boardTable);
      server.emit("statusGame", gameStatus); // Notifica a todos los clientes conectados
    } else {
      console.log("No hay tablero disponible");
      callback(null);
    }
  });
});

// Inicia el servidor en el puerto 8181 y escucha en todas las interfaces
httpsServer.listen(8181, "0.0.0.0", () => {
  console.log("Servidor HTTPS Socket.io escuchando en puerto 8181");
});
