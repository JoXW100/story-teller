import express from 'express';
import cors from 'cors';
import DBHandler from './db/dbHandler.js';
import stories from './routes/stories.js';
import files from './routes/files.js';
import assets from './routes/assets.js';

DBHandler.connect()
.catch((error) => console.error(error))
.then((result) => 
{
    if (result)
    {
        initListeners();
        work().catch(console.error());
    }
});

const initListeners = () => 
{
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use('/stories', stories);
    app.use('/files', files);
    app.use('/assets', assets);
    app.listen(8080, () => console.log("Server Started"));
}

const work = async () => 
{
    //let response = await DBHandler.assets.remove(ObjectId("61c082937714a2247bdb4b3d"));
    //console.log("work:", response);
}