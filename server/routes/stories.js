import express from 'express';
import Joi from 'joi';
import DBHandler from '../db/dbHandler.js';
import Validate from './validate.js';

const router = express.Router();

// add -> put, get -> get, remove -> remove

const objectID = Joi.string().min(24).max(24);
const shortString = Joi.string().min(1).max(64);

router.put("/add", async (request, response) => 
{
    const schema = Joi.object({
        name: shortString
    });

    if (Validate.schema(request.body, schema, response))
    {
        let data = { name: "Name", short: "A document about...", title: "Title", body: "Body" };
        let introductionKey = await DBHandler.documents.add(data);
        if (!introductionKey) return Validate.failure(response);

        let result = await DBHandler.stories.add(request.body.name, introductionKey);

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
        let result = await DBHandler.stories.get(params.id);

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
        let result = await DBHandler.stories.remove(request.body.id);

        return result ? Validate.success(response, result)
                      : Validate.failure(response);
    }
});

router.get("/getAll", async (request, response) => 
{
    if (Validate.schema(request.body, Joi.object(), response))
    {
        let result = await DBHandler.stories.getAllIds();

        return result ? Validate.success(response, result)
                      : Validate.failure(response);
    }
});

router.post("/update", async (request, response) => 
{
    const schema = Joi.object({
        id: objectID,
        story: Joi.object()
    });
    
    if (Validate.schema(request.body, schema, response))
    {
        let result = await DBHandler.stories.update(request.body.id, request.body.story.name, request.body.story.files);

        return result ? Validate.success(response, result)
                      : Validate.failure(response);
    }
});

export default router;