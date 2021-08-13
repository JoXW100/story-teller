import express, { query } from 'express';
import Joi from 'joi';
import multer from 'multer';
import DBHandler from '../db/dbHandler.js';
import Validate from './validate.js';
import { Readable } from 'stream';


const router = express.Router();

// add -> put, get -> get, remove -> remove, update -> post

const objectID = Joi.string().min(24).max(24);

const upload = multer();

router.post("/add", upload.single("file"), async (request, response) => 
{  
    let buffer = new Readable.from(request.file.buffer);
    let result = await DBHandler.images.add(request.file.originalname, buffer);
    return result ? Validate.success(response, result)
                  : Validate.failure(response);
});

router.get("/get", async (request, response) => 
{
    const params = {
        id: request.query.id
    }

    const schema = Joi.object({
        id: objectID
    });
    
    if (Validate.params(params, response) && Validate.schema(params, schema, response))
    {
        try 
        {
            return DBHandler.images.get(params.id).pipe(response);
        } 
        catch (error) 
        {
            console.error(error);
            return Validate.failure(response);
        }
    }
});

export default router;