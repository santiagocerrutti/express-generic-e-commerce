console.log("SOKET");

const socket = io();

socket.emit("message", "Este texto es enviado desde el front end");
socket.on("message", (data) => {
  console.log(data);
});

socket.on("broadcast-message", (data) => {
  console.log(data);
});
