"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var https_1 = require("https");
var fs_1 = require("fs");
var path = require("path");
// ✅ Carga segura desde la carpeta certs
var httpsServer = (0, https_1.createServer)({
    key: (0, fs_1.readFileSync)(path.resolve(__dirname, "certs/key.pem")),
    cert: (0, fs_1.readFileSync)(path.resolve(__dirname, "certs/cert.pem")),
});
var io = new socket_io_1.Server(httpsServer, {
    cors: {
        origin: "*", // ⚠️ En producción, restringe esto
    },
    transports: ["websocket", "polling"],
});
io.on("connection", function (socket) {
    console.log("Cliente conectado:", socket.id);
    socket.emit("mensaje", "Bienvenido!");
    socket.on("mensaje_cliente", function (data) {
        console.log("Recibido:", data);
    });
});
httpsServer.listen(8181, "0.0.0.0", function () {
    console.log("Servidor HTTPS Socket.io escuchando en puerto 8181");
});
