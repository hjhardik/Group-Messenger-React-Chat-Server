module.exports = {
  PORT: process.env.PORT || 8000,
  JWT_SECRET: process.env.JWT_SECRET || 'groupMessage-secret',
  MONGODB_URI:
    process.env.MONGODB_URI || 'mongodb://localhost/group-messenger-app',
};
