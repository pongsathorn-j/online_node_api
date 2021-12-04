require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` })

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  DOMAIN: process.env.DOMAIN,
  DOMAIN_GOOGLE_STORAGE: process.env.DOMAIN_GOOGLE_STORAGE,
  JWT_SECRET: process.env.JWT_SECRET
};
