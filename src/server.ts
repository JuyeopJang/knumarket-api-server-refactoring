import { initializeDatabase } from './lib/database';
import UserController from './api/user/user.con';
import App from './app';

async function startServer() {
  await initializeDatabase();

  const app = new App([
    new UserController()
  ]);

  app.listen();
  return app;
};

startServer();