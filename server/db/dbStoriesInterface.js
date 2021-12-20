import { Db, Collection, ObjectId as ObjectID } from 'mongodb';
import '../@types.js';

/**
 * Represents the public database interface related to stories
 * @class
 */
class DBStoriesInterface
{
    #collectionName = "Stories";

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
     * Adds a story to the database
     * @param {string} name The name of the story to add
     * @returns {Promise<?ObjectID>} The id of the story inside the database
     */
    async add(name)
    {
        try
        {
            let request = {
                name: name,
                description: "",
                defaultDocument: undefined,
                dateCreated: Date.now(),
                dateUpdated: Date.now()
            }

            let result = await this.#collection.insertOne(request);
            console.log(`Add: (${name})  => ${result.insertedId}`);
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
     * @returns {Promise<?DBStory>} The story
     */
    async get(storyID)
    {
        try
        {
            let result = await this.#collection.findOne({ _id: ObjectID(storyID) });
            console.log(`Get: ${storyID}`);
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
            console.log(`Remove: ${storyID} => ${result.deletedCount == 1}`);
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
     * @returns {Promise<?[ObjectID]>} The story
     */
    async getAllIds()
    {
        try
        {
            let result = await this.#collection.find().map(x => ObjectID(x._id)).toArray();
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
     * @param {StoryUpdateValues} values The values to update
     * @returns {Promise<?boolean>} If the story was updated
     */
    async update(storyID, values)
    {
        try
        {
            let filter = { _id: ObjectID(storyID) }
            let newValues = { 
                $set: { 
                    ...values,
                    dateUpdated: Date.now() 
                } 
            }
            
            // Enforce ObjectID rule
            if (newValues.$set.defaultDocument) newValues.$set.defaultDocument = ObjectID(newValues.$set.defaultDocument);

            let result = await this.#collection.updateOne(filter, newValues);
            console.log(`Update: ${storyID} <= (${result.modifiedCount == 1})`);
            return result.modifiedCount == 1;
        }
        catch (error)
        {
            console.error(error);
            return false;
        }
    }
}
 
export default DBStoriesInterface;
 