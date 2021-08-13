import express from 'express';
import cors from 'cors';
import DBHandler from './db/dbHandler.js';
import stories from './routes/stories.js';
import documents from './routes/documents.js';
import images from './routes/images.js';

DBHandler.connect()
.catch((error) => console.error(error))
.then((result) => 
{
    if (result) initListeners();
});

const initListeners = () => 
{
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use('/stories', stories);
    app.use('/documents', documents);
    app.use('/images', images);
    app.listen(8080, () => console.log("Server Started"));
}
