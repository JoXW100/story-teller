import { put, get, remove, post } from "./server";

class DocumentsCommunication
{
    #url;

    constructor(url)
    {
        this.#url = `${url}/documents`;
    }

    /**
     * Adds a document to the database
     * @param {*} data The content of the document
     * @returns {Promise<?{successful: boolean, result: string}>} The id of the document or null
     */
    async add()
    {
        return await put(`${this.#url}/add`, { data: { name: "Name", short: "A document about...", images: [], title: "Title", body: "Body" }});
    }
    
    /**
     * Gets a document from the database
     * @param {string} documentID The database identifer for the document
     * @returns {Promise<?{successful: boolean, result: StoryDocument}>} The document with the given id
     */
    async get(documentID)
    {
        return await get(`${this.#url}/get`, { id: documentID });
    }

    /**
     * Removes a document from the database
     * @param {string} documentID The database identifer for the document
     * @returns {Promise<?{successful: boolean, result: boolean}>} If the document was removed
     */
    async remove(documentID)
    {
        return await remove(`${this.#url}/remove`, { id: documentID });
    }

    /**
     * Updates a document in the database
     * @param {string} documentID The database identifer for the document
     * @param {*} data The document data
     * @returns {Promise<?{successful: boolean, result: boolean}>} If the document was updated
     */
    async update(documentID, data)
    {
        return await post(`${this.#url}/update`, { id: documentID, data: data});
    }
}

export default DocumentsCommunication;