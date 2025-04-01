import { initMongoConnection } from './db/initMongoConnection.js';
import { startServer } from './server.js';

await initMongoConnection();
startServer();
