import express, { Application } from 'express';
import router from './src/routes';
import './src/process';

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
