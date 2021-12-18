import { Db, Collection, ObjectId as ObjectID } from 'mongodb';
import '../@types.js';

const collectionName = "Documents";

/**
 * Represents the public database interface related to files
 * @class
 */
class DBFilesInterface
{
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
        this.#collection = this.#database.collection(collectionName);
    }

    /**
     * Adds a file to the database
     * @param {ObjectID} storyID The id of the parent story
     * @param {ObjectID} holderID The id of the parent file
     * @param {string} name The name of the file
     * @param {string} type The type of file
     * @param {DBFileContent} content The content of the file
     * @returns {Promise<?ObjectID>} The id of the file inside the database
     */
    async add(storyID, holderID, name, type, content)
    {
        try
        {
            let request = {
                storyID:  ObjectID(storyID),
                holderID: ObjectID(holderID),
                name: name,
                type: type,
                content: content,
                dateCreated: Date.now(),
                dateUpdated: Date.now()
            }
            let result = await this.#collection.insertOne(request);
            console.log(`Add: (${storyID}, ${name}) => ${result.insertedId}`);
            return result.insertedId;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Gets a file from the database
     * @param {ObjectID} fileID The id of the file to get
     * @returns {Promise<?DBDocument>} The file
     */
    async get(fileID)
    {
        try
        {
            let result = await this.#collection.findOne({ _id: ObjectID(fileID) });
            console.log(`Get: ${fileID}`);
            return result;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Gets all related file ids from the database
     * @param {ObjectID} storyID The id of the parent story
     * @returns {Promise<?[DBDocument]>} The file ids
     */
    async getAllFrom(storyID)
    {
        try
        {
            let result = await this.#collection.find({ storyID: ObjectID(storyID) }).toArray();
            console.log(`Get All From: ${storyID}`);
            return result;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Gets all related file ids from the database
     * @param {ObjectID} fileID The id of the file holder
     * @returns {Promise<?[DBDocument]>} The file ids
     */
    async getAllChildren(fileID)
    {
        try
        {
            let result = await this.#collection.find({ holderID: ObjectID(fileID) }).toArray();
            console.log(`Get All Children: ${fileID}`);
            return result;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Removes a file from the database
     * @param {ObjectID} fileID The id of the file to remove
     * @returns {Promise<?boolean>} If the file was removed
     */
    async remove(fileID)
    {
        try
        {
            let result = await this.#collection.deleteOne({ _id: ObjectID(fileID) });
            console.log(`Remove: ${fileID} => ${result.deletedCount == 1}`);
            return result.deletedCount == 1;
        }
        catch (error)
        {
            console.error(error);
            return false;
        }
    }

    /**
     * Updates a file in the database
     * @param {ObjectID} fileID The id of the file to update
     * @param {DBFileUpdateValues} values The values to update
     * @returns {Promise<?boolean>} If the file was updated
     */
    async update(fileID, values)
    {
        try
        {
            let filter = { _id: ObjectID(fileID) }
            let newValues = { 
                $set: {
                    ...values,
                    dateUpdated: Date.now()
                } 
            }

            if (values.holderID) newValues.$set.holderID = ObjectID(values.holderID);

            let result = await this.#collection.updateOne(filter, newValues);
            console.log(`Update: ${fileID} <= ${JSON.stringify(values)} (${result.modifiedCount == 1})`);
            return result.modifiedCount == 1;
        }
        catch (error)
        {
            console.error(error);
            return false;
        }
    }
}
 
export default DBFilesInterface;
 