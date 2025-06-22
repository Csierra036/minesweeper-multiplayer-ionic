import { Server } from "socket.io";
import { createServer } from "http";

const httpsServer = createServer({});
let boardTable: any = undefined;

const server = new Server(httpsServer, {
  cors: {
    origin: "*",
  },
});


server.on("connection", (socket) => {

  socket.on("tryConnectServer", () => {
    console.log("Cliente intentando conectarse al servidor:", socket.id);
    socket.emit("message", true);
  });

  socket.on("saveCreateBoard", (board: any) => {
    console.log("Tablero creado:", board);
    boardTable = board;
  })

  socket.on("checkBoardExist", () => {
    if (boardTable) {
      socket.emit("boardExists", true);
    }
    else {
      socket.emit("boardExists", false);
    }
  });

});

httpsServer.listen(8181, "0.0.0.0", () => {
  console.log("Servidor HTTPS Socket.io escuchando en puerto 8181");
});




// import { Server } from "socket.io";
// import { createServer } from "http";
// import { readFileSync } from "fs";
// import * as path from "path"


// // ✅ Carga segura desde la carpeta certs
// const httpsServer = createServer({
//   // key: readFileSync(path.resolve(__dirname, "certs/key.pem")),
//   // cert: readFileSync(path.resolve(__dirname, "certs/cert.pem")),
// });


// const io = new Server(httpsServer, {
//   cors: {
//     origin: "*", // ⚠️ En producción, restringe esto
//   },
//   // transports: ["websocket","],
// });


// io.on("connection", (socket) => {
//   console.log("Cliente conectado:", socket.id);
//   socket.emit("mensaje", "Bienvenido!");
//   socket.on("mensaje_cliente", (data) => {
//     console.log("Recibido:", data);
//   });
// });


// httpsServer.listen(8181, "0.0.0.0", () => {
//   console.log("Servidor HTTPS Socket.io escuchando en puerto 8181");
// });