const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const SocketIOServer = require('socket.io');
const routes = require('./routes');
const socketio = require('./middlewares/socketio');
const { MONGODB_URI } = require('./config');

const app = express();

// Allow CORS
app.use(cors());

// Create servers
const server = http.createServer(app);
const io = SocketIOServer(server);

// Open MongoDB connection
mongoose.Promise = Promise;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  // eslint-disable-next-line
  console.error('Database connection error:', error);
});

db.once('open', () => {
  // eslint-disable-next-line
  console.log('Database connected!');
});

// Use url body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add socket.io

app.use(socketio(io));

// Use routers

app.use('/v1', routes);

// Start listening

server.listen(process.env.PORT || 8000, () => {
  // eslint-disable-next-line
  console.log(`App is listening on ${server.address().port}`);
});

// Handling unhandled rejections

process.on('unhandledRejection', (reason, promise) => {
  // eslint-disable-next-line
  console.error('Unhandled Rejection at:', promise);
  // eslint-disable-next-line
  console.error('Reason:', reason);
});
