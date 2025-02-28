import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    console.log('Creando Mongoose...');
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/defaultdb';
    console.log(`Conectando a ${uri}`);
    return {
      uri,
      connectionFactory: (connection: Connection) => {
        connection.on('connected', () => {
          console.log('Conecto con exito a la base de datos');
        });
        connection.on('error', (err) => {
          console.error('Error al conectarse a la base de datos', err);
        });
        return connection;
      },
      retryAttempts: 5,
      retryDelay: 3000,
    };
  }
}
