const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const rosnodejs = require('rosnodejs');
const path = require('path'); // Add this line to import the 'path' module

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve your static files (e.g., HTML, CSS, client-side scripts)
app.use(express.static(path.join(__dirname, 'public')));

// Initialize ROS node
rosnodejs.initNode('/ros_websocket_server')
  .then((rosNode) => {
    // Set up ROS subscriber
    const imuListener = rosNode.subscribe('/imu_data/quat', 'sensor_msgs/Imu', (message) => {
      // Emit the received IMU message to all connected WebSocket clients
      io.emit('imuData', message);
    });
  })
  .catch((err) => {
    console.error('Error initializing ROS node:', err);
  });

// Set up WebSocket connection
io.on('connection', (socket) => {
  console.log('WebSocket client connected');

  // Example: Handle a custom event from the client
  socket.on('customEvent', (data) => {
    console.log('Received custom event from client:', data);
  });

  // Example: Send a message to the client
  socket.emit('message', 'Hello from server');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('WebSocket client disconnected');
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
