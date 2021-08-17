import { Db, Collection, ObjectId as ObjectID, ObjectId } from 'mongodb';
import '../@types.js';
import DBHandler from './dbHandler.js';

const collectionName = "Stories";

/**
 * Represents the public database interface related to stories
 * @class
 */
class DBStoriesInterface
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
     * Adds a story to the database
     * @param {string} name The name of the story to add
     * @param {ObjectId} introductionKey The key to the introduction document
     * @returns {Promise<?ObjectID>} The id of the story inside the database
     */
    async add(name, introductionKey)
    {
        try
        {
            let request = {
                name: name,
                introduction: 
                {
                    name: "introduction",
                    filetype: "doc",
                    content: ObjectID(introductionKey)
                },
                files: [],
                dateCreated: Date.now(),
                dateUpdated: Date.now()
            }

            let result = await this.#collection.insertOne(request);
            console.log(`Add: (${name}, ${introductionKey})  => ${result}`);
            return result.insertedId;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Gets a story from the database
     * @param {ObjectID} storyID The id of the story to get
     * @returns {Promise<?Story>} The story
     */
    async get(storyID)
    {
        try
        {
            let result = await this.#collection.findOne({ _id: ObjectID(storyID) });
            console.log(`Get: ${storyID} => ${result}`);
            return result;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Removes a story from the database
     * @param {ObjectID} storyID The id of the story to remove
     * @returns {Promise<?boolean>} If the story was removed
     */
    async remove(storyID)
    {
        try
        {
            let result = await this.#collection.deleteOne({ _id: ObjectID(storyID) });
            console.log(`Remove: ${storyID} => ${result}`);
            return result.deletedCount == 1;
        }
        catch (error)
        {
            console.error(error);
            return false;
        }
    }

    /**
     * Gets all stories from the database
     * @returns {Promise<?[string]>} The story
     */
    async getAll()
    {
        try
        {
            let result = await this.#collection.find({})
                                               .map(x => x._id)
                                               .toArray();
            console.log(`GetAll: => ${result}`);
            return result;
        }
        catch (error)
        {
            console.error(error);
            return null;
        }
    }

    /**
     * Updates a story in the database
     * @param {ObjectID} storyID The id of the story to update
     * @param {string} name The name of the story
     * @param {[StoryFile]} files The file structure of the story
     * @returns {Promise<?boolean>} If the story was updated
     */
    async update(storyID, name, files)
    {
        try
        {
            let filter = { _id: ObjectID(storyID) }
            let newValues = { $set: { dateUpdated: Date.now() } }

            if (name)  newValues.$set.name  = name;
            if (files) newValues.$set.files = files;

            let result = await this.#collection.updateOne(filter, newValues);
            console.log(`Update: (${storyID}, ${name}, ${files}) => ${result}`);
            return result.modifiedCount == 1;
        }
        catch (error)
        {
            console.error(error);
            return false;
        }
    }

    /**
     * Sets a field for all documents, can be used to add a new field
     * @param {string} name The name of the property
     * @param {*} value The value of the property
     * @returns {Promise<boolean>} IF the property was set
     */
    async setField(name, value)
    {
        try
        {
            let change = { $set: { [name]: value } }
            let result = await this.#collection.updateMany({}, change);
            return result.modifiedCount > 0;
        }
        catch (error)
        {
            console.error(error);
            return false;
        }
    }
}
 
export default DBStoriesInterface;
 