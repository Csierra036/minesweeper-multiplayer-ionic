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
  console.log("Cliente conectado:", socket.id);
  socket.emit("mensaje", "Bienvenido!");
  socket.on("mensaje_cliente", (data) => {
    console.log("Recibido:", data);
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