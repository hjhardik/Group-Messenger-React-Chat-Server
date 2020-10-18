const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const { sendMessage } = require('../controllers/messages');

// Socket.IO Middleware for Auth
function socketAuth(socket, next) {
  const { token } = socket.handshake.query;

  if (!token) {
    return next(new Error('Failed to authenticate socket'));
  }

  return jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Failed to authenticate socket'));
    }

    // eslint-disable-next-line
    socket.decoded = decoded;
    return next();
  });
}
// take a look at this link for socket.io working https://socket.io/get-started/chat/
function socketio(io) {
  io.use(socketAuth);

  //when a socket is connected
  io.on('connection', (socket) => {
    socket.on('mount-chat', (chatId) => {
      socket.join(chatId);
    });

    socket.on('unmount-chat', (chatId) => {
      socket.leave(chatId);
    });

    socket.on('send-message', (newMessage, fn) => {
      const { chatId, content } = newMessage;
      return sendMessage(socket.decoded.userId, chatId, { content })
        .then(({ success, message }) => {
          io.to(chatId).emit('new-message', {
            success,
            message,
          });
          fn({
            success,
            message,
          });
        })
        .catch((error) => {
          // Handle errors
          // eslint-disable-next-line
          console.log(error);
        });
    });
  });

  //send the io variable with the response
  return (req, res, next) => {
    res.io = io;
    next();
  };
}

module.exports = socketio;
