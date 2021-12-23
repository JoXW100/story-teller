import { Db, Collection, ObjectId as ObjectID, GridFSBucket } from 'mongodb';
import { ReadStream } from 'fs';
import '../@types.js';

/**
 * Represents the public database interface related to documents
 * @class
 */
class DBAssetFileInterface
{
    #collectionName = "Assets.Stream";

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
        this.#collection = database.collection(`${this.#collectionName}.files`);
        this.#bucket = new GridFSBucket(this.#database, { bucketName: this.#collectionName });
    }

    /**
     * Adds an asset file to the database
     * @param {string} name 
     * @param {ReadStream} fileStream
     * @returns {Promise<?ObjectID>} The database id of the added file
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
            
            
            console.log(`AssetFileAdd: => ${response._id}`);
            return response._id;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Gets an asset file stream from the database
     * @param {ObjectID} fileID Asset file id
     * @returns {ReadStream} The assets file stream
     */
    get(fileID)
    {
        try 
        {
            console.log("getFile", fileID);
            return this.getData(fileID) 
                ? this.#bucket.openDownloadStream(ObjectID(fileID))
                : null;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Gets the assets file data from the database
     * @param {ObjectID} dataID The id of the asset file
     * @returns {Promise<?DBAssetFileInfo>} The data related to the asset file
     */
    async getData(dataID)
    {
        try 
        {
            let result = await this.#collection.findOne({ _id: ObjectID(dataID) });
            console.log(`GetData: ${dataID}`);
            return result;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Removes an asset file from the database
     * @param {ObjectID} fileID The id of the file
     * @returns {Promise<boolean>} If the asset file was removed or not
     */
    async remove(fileID)
    {
        try 
        {
            await this.#bucket.delete(ObjectID(fileID));
            console.log(`Remove: ${fileID} => ${true}`);
            return true;
        }
        catch (error)
        {
            console.error(error);
            return false;
        }
    }
}
 
export default DBAssetFileInterface;
 