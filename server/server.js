import express from 'express';
import cors from 'cors';
import DBHandler from './db/dbHandler.js';
import stories from './routes/stories.js';
import documents from './routes/documents.js';
import assets from './routes/assets.js';

DBHandler.connect()
.catch((error) => console.error(error))
.then((result) => 
{
    if (result)
    {
        initListeners();
        addField().catch(console.error());
    }
});

const initListeners = () => 
{
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use('/stories', stories);
    app.use('/documents', documents);
    app.use('/images', assets);
    app.listen(8080, () => console.log("Server Started"));
}

const addField = async () => 
{
    //let response = await DBHandler.documents.setField("data.images", []);
    //console.log(response);
}