import { Db } from 'mongodb';
import DBConnectionHandler from './dbConnectionHandler.js';
import DBDocumentsInterface from './dbDocumentsInterface.js';
import DBAssetFileInterface from './dbAssetFileHandler.js';
import DBStoriesInterface from './dbStoriesInterface.js';
import DBAssetInterface from './dbAssetHandler.js';

const testDBName = "StoryTellerTest";
const dbName = "StoryTeller";

/**
 * Represents the public interface of a database
 * @public
 * @static
 * @class
 */
class DBHandler
{
    /** @type {DBConnectionHandler} @private */
    static #connection;
    /** @type {Db} @private */
    static #database;
    /** @type {Boolean} @private */
    static #isTesting;

    /** @type {DBStoriesInterface} @private */
    static #stories;

    /** @type {DBDocumentsInterface} @private */
    static #documents;

    /** @type {DBAssetInterface} @private */
    static #assets;

    /** @type {DBAssetFileInterface} @private */
    static #assetFiles;

    /**
     * The interface responsible for handling stories
     * @type {DBStoriesInterface}
     */
    static get stories()
    {
        return this.#stories;
    }

    /**
     * The interface responsible for handling documents
     * @type {DBDocumentsInterface}
     */
    static get documents()
    {
        return this.#documents;
    }

    /**
     * The interface responsible for handling images
     * @type {DBAssetInterface}
     */
    static get assets()
    {
        return this.#assets;
    }

    /**
     * The interface responsible for handling images
     * @type {DBAssetFileInterface}
     */
    static get assetFiles()
    {
        return this.#assetFiles;
    }

    /**
     * Establishes a database connection
     * @returns {Promise<Boolean>} If connection was successful
     */
    static async connect(host = "localhost", port = "27018", url = undefined, isTesting = false)
    {
        this.#connection = new DBConnectionHandler(url ? url : `mongodb://${host}:${port}`);
        this.#isTesting  = isTesting;

        let client = await this.#connection.connectAsync();
        if (client)
        {
            console.log("Connection Successful");
            this.#database = client.db(this.#isTesting ? testDBName : dbName);
            this.#stories    = new DBStoriesInterface(this.#database);
            this.#documents  = new DBDocumentsInterface(this.#database);
            this.#assets     = new DBAssetInterface(this.#database);
            this.#assetFiles = new DBAssetFileInterface(this.#database);
            return true;
        }
        console.log("Connection Failed");
        return false;
    }

    /**
     * Closes the database connection
     * @returns {Promise<void>}
     */
    static async close()
    {
        await this.#connection.close().then(() => 
        {
            this.#database = null;
            this.#stories = null;
            this.#documents = null;
            this.#assets = null;
            this.#assetFiles = null;
        });
    }

    /**
     * Clears the database, does nothing if not in testing mode
     * @async
     * @returns {Promise<void>}
     */
    static async clear()
    {
        if (this.#database && this.#isTesting)
        {
            await this.#database.dropDatabase();
        }
    }
}

export default DBHandler;