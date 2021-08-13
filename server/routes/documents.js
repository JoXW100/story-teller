import express, { query } from 'express';
import Joi from 'joi';
import DBHandler from '../db/dbHandler.js';
import Validate from './validate.js';

const router = express.Router();

// add -> put, get -> get, remove -> remove, update -> post

const objectID = Joi.string().min(24).max(24);

router.put("/add", async (request, response) => 
{
    const schema = Joi.object({
        data: Joi.any()
    });
    
    if (Validate.schema(request.body, schema, response))
    {
        let result = await DBHandler.documents.add(request.body.data);

        return result ? Validate.success(response, result)
                      : Validate.failure(response);
    }
});

router.get("/get", async (request, response) => 
{
    const params = {
        id: request.query.id
    }
    
    if (Validate.params(params, response))
    {
        let result = await DBHandler.documents.get(params.id);

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
        let result = await DBHandler.documents.remove(request.body.id);

        return result ? Validate.success(response, result)
                      : Validate.failure(response);
    }
});

router.post("/update", async (request, response) => 
{
    const schema = Joi.object({
        id: objectID,
        data: Joi.any()
    });
    
    if (Validate.schema(request.body, schema, response))
    {
        let result = await DBHandler.documents.update(request.body.id, request.body.data);

        return result ? Validate.success(response, result)
                      : Validate.failure(response);
    }
});

export default router;