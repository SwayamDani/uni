// WebSocketClient.js
const socket = new WebSocket('ws://localhost:3000/ws');

socket.onopen = () => {
  socket.send('Hello Server!');
};

socket.onmessage = (event) => {
};

socket.onerror = (error) => {
  console.error(`WebSocket error: ${error.message}`);
};

socket.onclose = () => {
};
