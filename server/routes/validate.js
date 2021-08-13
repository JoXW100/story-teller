import express from 'express';
import Joi from 'joi';

/**
 * @typedef RequestResponse
 * @type {express.Response<any, Record<string, any>, number>}
 */

class Validate
{
    /**
     * 
     * @param {*} body The request body
     * @param {Joi.AnySchema} schema The schema
     * @param {RequestResponse} response The request response
     * @returns {boolean} If the schema was valid
     */
    static schema(body, schema, response) 
    {
        let result = schema.validate(body);
        return result.error 
            ? this.failure(response, result.error.message)
            : true;
    }

    /**
     * 
     * @param {Object.<string, any>} params The request body
     * @param {Joi.AnySchema} schema The schema
     * @param {RequestResponse} response The request response
     * @returns {boolean} If the schema was valid
     */
    static params(params, response) 
    {
        return Object.values(params).every((param) => param !== undefined) 
            ? true 
            : this.failure(response, "param mismatch");
    }

    /**
     * Sends a failure response to the request
     * @param {RequestResponse} response The request response
     * @param {string} message The message
     * @returns {false}
     */
    static failure(response, message = "unsuccessful")
    {
        console.log("failure");
        response.status(404).json({ successful: false, message: message });
        return false;
    }

    /**
     * Sends a failure response to the request
     * @param {RequestResponse} response The request response
     * @param {*} result The result of the request
     * @returns {true}
     */
    static success(response, result)
    {
        console.log("success");
        response.json({ successful: true, result: result });
        return true;
    }
}

export default Validate;