import { Db, Collection, ObjectId as ObjectID } from 'mongodb';
import '../@types.js';

/**
 * Represents the public database interface related to documents
 * @class
 */
class DBAssetInterface
{
    #collectionName = "Assets";

    /** @type {Db} @private */
    #database;

    /** @type {Collection} @private */
    #collection;
    
    /**
     * Creates a new DBRequestInterface
     * @constructor
     * @param {Db} database The database to use
     */
    constructor(database)
    {
        this.#database = database;
        this.#collection = this.#database.collection(this.#collectionName);
    }

    /**
     * Adds an asset to the database
     * @param {ObjectID} documentID The id of the related document
     * @param {ObjectID} assetFileID The id of the assetFile
     * @param {string} name The name of the asset
     * @param {string} type The type of asset
     * @param {string} description The asset description
     * @returns {Promise<?ObjectID>} The id of the document inside the database
     */
    async add(documentID, assetFileID, name, type, description)
    {
        try
        {
            let request = {
                documentID: ObjectID(documentID),
                assetFileID: ObjectID(assetFileID),
                name: name,
                type: type,
                description: description,
                dateCreated: Date.now(),
                dateUpdated: Date.now()
            }
            
            let result = await this.#collection.insertOne(request);
            console.log(`Add: (${name}) => ${result.insertedId}`);
            return result.insertedId;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Gets an asset from the database
     * @param {ObjectID} assetID The id of the asset to get
     * @returns {Promise<?DBAsset>} The asset
     */
    async get(assetID)
    {
        try
        {
            let result = await this.#collection.findOne({ _id: ObjectID(assetID) });
            console.log(`Get: ${assetID}`);
            return result;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Gets the related assets from the database
     * @param {ObjectID} documentID The id of the asset to get
     * @returns {Promise<?[DBAsset]>} The ids of the assets
     */
    async getRelated(documentID)
    {
        try
        {
            let result = await this.#collection.find({ documentID: ObjectID(documentID) }).toArray();
            console.log(`Get Related: ${documentID}`);
            return result;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Removes an asset from the database
     * @param {ObjectID} assetID The id of the asset to remove
     * @returns {Promise<?DBAsset>}>} The removed asset
     */
    async remove(assetID)
    {
        try
        {
            let result = await this.#collection.findOneAndDelete({ _id: ObjectID(assetID) });
            console.log(`Remove: ${assetID} => ${result !== null}`);
            return result ? result.value : result;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Updates a asset in the database
     * @param {ObjectID} assetID The id of the asset to update
     * @param {DBAssetUpdateValues} values The data to update
     * @returns {Promise<boolean>} If the asset was updated
     */
    async update(assetID, values)
    {
        try
        {
            let filter = { _id: ObjectID(assetID) }
            let newValues = { 
                $set: { 
                    ...values,
                    dateUpdated: Date.now()
                } 
            }

            let result = await this.#collection.updateOne(filter, newValues);
            console.log(`Update: ${assetID} ${values} => ${result}`);
            return result.modifiedCount == 1;
        }
        catch (error)
        {
            console.error(error);
            return false;
        }
    }
}
 
export default DBAssetInterface;
 