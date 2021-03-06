import { put, get, remove, post } from "./server";

class StoriesCommunication
{
    #url;

    constructor(url)
    {
        this.#url = `${url}/stories`;
    }

    /**
     * Adds a story to the database
     * @param {string} name The name of the story
     * @returns {Promise<?{successful: boolean, result: string}>} The id of the story or null
     */
    async add(name)
    {
        return await put(`${this.#url}/add`, { name: name });
    }
    
    /**
     * Gets a story from the database
     * @param {string} storyID The database identifier for the story
     * @returns {Promise<?{successful: boolean, result: DBStory}>} The story with the given id
     */
    async get(storyID)
    {
        return await get(`${this.#url}/get`, { id: storyID });
    }

    /**
     * Removes a story from the database
     * @param {string} storyID The database identifier for the story
     * @returns {Promise<?{successful: boolean, result: boolean}>} If the story was removed
     */
    async remove(storyID)
    {
        return await remove(`${this.#url}/remove`, { id: storyID });
    }

    /**
     * Gets a story from the database
     * @param {string} storyID The database identifier for the story
     * @returns {Promise<?{successful: boolean, result: [string]}>} The story with the given id
     */
    async getAll()
    {
        return await get(`${this.#url}/getAll`);
    }

    /**
     * Updates a story in the database
     * @param {string} storyID The database identifier for the story
     * @param {DBStoryUpdateValues} data The values to update
     * @returns {Promise<?{successful: boolean, result: boolean}>} If the story was updated
     */
    async update(storyID, data)
    {
        return await post(`${this.#url}/update`, { id: storyID, data: data });
    }
}

export default StoriesCommunication;