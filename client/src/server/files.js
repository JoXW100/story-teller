import { put, get, remove, post } from "./server";
import "../@types";

class FilesCommunication
{
    #url;

    constructor(url)
    {
        this.#url = `${url}/files`;
    }

    /**
     * Adds a document to the database
     * @param {ObjectID} storyID The id of the parent story
     * @param {ObjectID} holderID The id of the holder file
     * @param {string} name The name of the file
     * @param {string} type The type of the file
     * @param {DBFileContent} content The content of the file
     * @returns {Promise<?{successful: boolean, result: string}>} The id of the document or null
     */
    async add(storyID, holderID, name, type, content)
    {
        return await put(`${this.#url}/add`, { 
            storyID: storyID,
            holderID: holderID,
            name: name,
            type: type,
            content: content
        });
    }
    
    /**
     * Gets a file from the database
     * @param {string} fileID The database identifier for the file
     * @returns {Promise<?{successful: boolean, result: DBDocument}>} The file with the given id
     */
    async get(fileID)
    {
        return await get(`${this.#url}/get`, { id: fileID });
    }

    /**
     * Gets identifiers of related file from the database
     * @param {string} storyID The database identifier for the related story
     * @returns {Promise<?{successful: boolean, result: [DBDocument]}>} The files with the given story id
     */
    async getAllFrom(storyID)
    {
        return await get(`${this.#url}/getAllFrom`, { id: storyID });
    }

    /**
     * Gets identifiers of related files from the database
     * @param {string} fileID The database identifier for the file holder
     * @returns {Promise<?{successful: boolean, result: [DBDocument]}>} The files with the given holder id
     */
    async getAllChildren(fileID)
    {
        return await get(`${this.#url}/getAllChildren`, { id: fileID });
    }

    /**
     * Removes a file from the database
     * @param {string} fileID The database identifier for the file
     * @returns {Promise<?{successful: boolean, result: boolean}>} If the file was removed
     */
    async remove(fileID)
    {
        return await remove(`${this.#url}/remove`, { id: fileID });
    }

    /**
     * Updates a file in the database
     * @param {string} fileID The database identifier for the file
     * @param {DBFileUpdateValues} data The file update data
     * @returns {Promise<?{successful: boolean, result: boolean}>} If the file was updated
     */
    async update(fileID, data)
    {
        return await post(`${this.#url}/update`, { id: fileID, data: data });
    }
}

export default FilesCommunication;