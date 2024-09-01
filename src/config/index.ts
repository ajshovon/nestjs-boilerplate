export default () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.NEST_PORT, 10) || 3000,
  database: {
    type: process.env.DATABASE_TYPE || 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['dist/**/*.entity.js'],
    synchronize: true,
  },
  auth: {
    hashRounds: parseInt(process.env.BCRYPT_ROUNDS),
    jwtSecret: process.env.JWT_SECRET,
  },
  defaultUser: {
    email: process.env.DEFAULT_EMAIL,
    password: process.env.DEFAULT_PASS,
  },
  swagger: {
    title: process.env.SWAGGER_TITLE,
    description: process.env.SWAGGER_DESC,
    version: process.env.SWAGGER_VERSION,
    path: process.env.SWAGGER_PATH,
  },
});
