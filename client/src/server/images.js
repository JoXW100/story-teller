import { postFile, getFile } from "./server";
import * as FileSystem from 'fs';

class ImagesCommunication
{
    #url;

    constructor(url)
    {
        this.#url = `${url}/images`;
    }

    /**
     * Adds an image to the database
     * @param {File} file
     * @returns {Promise<?{successful: boolean, result: string}>} The id of the image or null
     */
    async add(file)
    {
        let data = new FormData();
        data.append("file", file)
        return await postFile(`${this.#url}/add`, data);
    }

    /**
     * Gets an image to the database
     * @param {string} imageID
     * @returns {Promise<?{successful: boolean, result: string}>} The id of the document or null
     */
    async get(imageID)
    {
        return await getFile(`${this.#url}/get`, { id: imageID });
    }
}

export default ImagesCommunication;