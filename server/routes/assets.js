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

    console.log(request);
    /*
    let file = await DBHandler.assetFiles.add(name, buffer);
    if (file)
    {
        let result = await DBHandler.assets.add(name)
    }
    return result ? Validate.success(response, result)
                  : Validate.failure(response);
    */
});

router.get("/get", async (request, response) => 
{
    const params = {
        id: request.query.id
    }
    
    if (Validate.params(params, response))
    {
        let result = await DBHandler.assets.get(params.id);

        return result ? Validate.success(response, result)
                      : Validate.failure(response);
    }
});

router.get("/getRelated", async (request, response) => 
{
    const params = {
        id: request.query.id
    }
    
    if (Validate.params(params, response))
    {
        let result = await DBHandler.assets.getRelated(params.id);

        return result ? Validate.success(response, result)
                      : Validate.failure(response);
    }
});

router.get("/getFile", async (request, response) => 
{
    const params = {
        id: request.query.id
    }
    
    if (Validate.params(params, response))
    {
        try 
        {
            let stream = DBHandler.assetFiles.get(params.id);
            stream.on("error", () => Validate.failure(response));
            return stream.pipe(response);
        } 
        catch (error) 
        {
            console.error(error);
            return Validate.failure(response);
        }
    }
});

router.get("/getData", async (request, response) => 
{
    const params = {
        id: request.query.id
    }
    
    if (Validate.params(params, response))
    {
        let result = await DBHandler.assetFiles.getData(params.id);
        return result ? Validate.success(response, result)
                      : Validate.failure(response);
    }
});

router.delete("/remove", async (request, response) => 
{
    const schema = Joi.object({
        id: objectID
    });
    
    if (Validate.schema(request.body, schema, response))
    {
        let result = await DBHandler.assets.remove(request.body.id);
        if (result)
        {
            result = await DBHandler.assetFiles.remove(result.fileID)
            return result ? Validate.success(response, result)
                          : Validate.failure(response);
        }
        return Validate.failure(response);
    }
});

export default router;