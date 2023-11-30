import { NodeEnviorment } from 'src/common/enums/global.enum';
export function getMongoURL() {
  const { NODE_ENV, MONGO_DATABSE, MONGO_HOST, MONGO_PORT } = process.env;

  const connection =
    NODE_ENV == NodeEnviorment.DEV
      ? `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABSE}`
      : 'mongodb://webidemy8080:webidemy8080@127.0.0.1:27017/webidemyDb?directConnection=true&serverSelectionTimeoutMS=2000&authSource=admin';

      
  return connection;
}
