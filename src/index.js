import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

await initMongoConnection();

setupServer();
