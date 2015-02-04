
var fs = require("fs");
var server = require("http").createServer(function(req, res) {
  res.writeHead(200, {"Content-Type":"text/html"});
  var output = fs.readFileSync("./chatRoomClient.html", "utf-8");
  res.end(output);
}).listen(8080);

var io = require("socket.io")(server);

io.set('transports', ['websocket', 'polling']);

io.on("connection", function (socket) {
  console.log("connection[" + socket.id + "]");
  socket.once("joinRoom", function (roomNum) {
    socket.join(roomNum);
    console.log("id[" + socket.id + "] -> room[" + roomNum + "]");
    io.to(roomNum).emit("msgForConsole", "[join]" + socket.id);
  });
  socket.once("leaveRoom", function (roomNum) {
    socket.leave(socket.rooms[1]);
    console.log("id[" + socket.id + "] <- room[" + roomNum + "]");
    io.to(socket.rooms[1]).emit("msgForConsole", "[leave]" + socket.id);
  });
  socket.on("addMessage", function (message) {
    console.log("[" + socket.id + "]: " + message);
    io.to(socket.rooms[1]).emit("msgForConsole", socket.id + ": " + message);
  });
});
