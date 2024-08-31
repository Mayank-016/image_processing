import express from 'express';
const app = express();

//Configuring express to parse json
app.use(express.json({ limit: '50kb' }));
//Configuring express to parse url params
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
app.use(express.static('public'));


// import routes
import { apiRouter } from './routes/api.routes.js';
// use routes
app.use('/api/v1', apiRouter);

// Default home route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

export { app };