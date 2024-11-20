// WebSocketClient.js
const socket = new WebSocket('ws://localhost:3000/ws');

socket.onopen = () => {
  console.log('Connected to WebSocket server');
  socket.send('Hello Server!');
};

socket.onmessage = (event) => {
  console.log(`Received message: ${event.data}`);
};

socket.onerror = (error) => {
  console.error(`WebSocket error: ${error.message}`);
};

socket.onclose = () => {
  console.log('WebSocket connection closed');
};
