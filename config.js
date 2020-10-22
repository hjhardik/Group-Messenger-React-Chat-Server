require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'groupMessage-secret',
  MONGODB_URI:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/group-messenger-app',
};
