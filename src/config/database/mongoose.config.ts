import { NodeEnviorment } from 'src/common/enums/global.enum';
export function getMongoURL() {
  const { NODE_ENV, MONGO_DATABSE, MONGO_HOST, MONGO_PORT } = process.env;

  const connection =
    NODE_ENV == NodeEnviorment.DEV
      ? `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABSE}`
      : 'mongodb://pachim:zamani8080127.0.0.1:27017/webidemydb?directConnection=true&serverSelectionTimeoutMS=2000&authSource=admin';

      
  return connection;
}
