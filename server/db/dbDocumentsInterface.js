import { Db, Collection, ObjectId as ObjectID } from 'mongodb';
import '../@types.js';

const collectionName = "Documents";

/**
 * Represents the public database interface related to documents
 * @class
 */
class DBDocumentsInterface
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
     * Adds a document to the database
     * @param {ObjectID} storyID The id of the parent story
     * @param {string} name The name of the document
     * @param {string} type The type of document
     * @param {string} filePath The filepath of the document
     * @param {string} content The content of the document
     * @param {Object<string, *>} data The document data
     * @returns {Promise<?ObjectID>} The id of the document inside the database
     */
    async add(storyID, name, type, filePath, content, data)
    {
        try
        {
            let request = {
                storyID: ObjectID(storyID),
                name: name,
                type: type,
                filePath: filePath,
                content: content,
                data: data,
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
     * Gets a document from the database
     * @param {ObjectID} documentID The id of the document to get
     * @returns {Promise<?DBDocument>} The document
     */
    async get(documentID)
    {
        try
        {
            let result = await this.#collection.findOne({ _id: ObjectID(documentID) });
            console.log(`Get: ${documentID}`);
            return result;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Removes a document from the database
     * @param {ObjectID} documentID The id of the document to remove
     * @returns {Promise<?boolean>} If the document was removed
     */
    async remove(documentID)
    {
        try
        {
            let result = await this.#collection.deleteOne({ _id: ObjectID(documentID) });
            console.log(`Remove: ${documentID} => ${result.deletedCount == 1}`);
            return result.deletedCount == 1;
        }
        catch (error)
        {
            console.error(error);
            return false;
        }
    }

    /**
     * Updates a document in the database
     * @param {ObjectID} documentID The id of the document to update
     * @param {DBDocumentUpdateValues} values The values to update
     * @returns {Promise<?boolean>} If the document was updated
     */
    async update(documentID, values)
    {
        try
        {
            let filter = { _id: ObjectID(documentID) }
            let newValues = { 
                $set: {
                    ...values,
                    dateUpdated: Date.now()
                } 
            }

            let result = await this.#collection.updateOne(filter, newValues);
            console.log(`Update: ${documentID} <= ${data} (${result.modifiedCount == 1})`);
            return result.modifiedCount == 1;
        }
        catch (error)
        {
            console.error(error);
            return false;
        }
    }
}
 
export default DBDocumentsInterface;
 