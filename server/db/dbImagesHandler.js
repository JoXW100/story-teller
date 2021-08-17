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
            console.log("ID", id);
            return this.getData(id) 
                ? this.#bucket.openDownloadStream(ObjectID(id))
                : null;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Adds an image to the database
     * @param {ObjectID} imageID The id of the image
     * @returns {Promise<?ImageInfo>} The data related to the image
     */
    async getData(imageID)
    {
        try 
        {
            let result = await this.#collection.findOne({ _id: ObjectID(imageID) });
            console.log(`GetData: ${imageID} => ${result}`);
            return result;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Removes an image from the database
     * @param {ObjectID} imageID The id of the image
     * @returns {Promise<boolean>} If the image was removed or not
     */
    async remove(imageID)
    {
        try 
        {
            let result = await this.#bucket.delete(ObjectID(imageID));
            console.log(`Remove: ${imageID} => ${result}`);
            return true;
        }
        catch (error)
        {
            console.error(error);
            return false;
        }
    }
}
 
export default DBImagesInterface;
 