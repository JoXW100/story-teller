import { Db, Collection, ObjectId as ObjectID, GridFSBucket } from 'mongodb';
import '../@types.js';
import * as FileSystem from 'fs';

const collectionName = "Images";

/**
 * Represents the public database interface related to documents
 * @class
 */
class DBImagesInterface
{
    /** @type {Db} @private */
    #database;

    /** @type {Collection} @private */
    #collection;

    /** @type {GridFSBucket} @private */
    #bucket;
    
    /**
     * Creates a new DBRequestInterface
     * @constructor
     * @param {Db} database The database to use
     */
    constructor(database)
    {
        this.#database = database;
        this.#collection = database.collection(`${collectionName}.files`);
        this.#bucket = new GridFSBucket(this.#database, { bucketName: collectionName });
    }

    /**
     * Adds an image to the database
     * @param {string} name 
     * @param {FileSystem.ReadStream} fileStream
     * @returns {Promise<?string>} The database id of the added file
     */
    async add(name, fileStream)
    {
        try 
        {
            let response = await new Promise((resolve, reject) => {
                fileStream.pipe(this.#bucket.openUploadStream(name))
                    .on('error', reject)
                    .on('finish', resolve);
            });
            
            console.log(response);
            return response._id;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Adds an image to the database
     * @param {ObjectID} id 
     * @returns {FileSystem.ReadStream} The database id of the added file
     */
    get(id)
    {
        try 
        {
            return this.#bucket.openDownloadStream(ObjectID(id));
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }
}
 
export default DBImagesInterface;
 