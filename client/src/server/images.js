import { get, remove, postFile, getFile } from "./server";

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
     * @returns {Promise<?Blob>} The id of the document or null
     */
    async get(imageID)
    {
        return await getFile(`${this.#url}/get`, { id: imageID });
    }

    /**
     * Gets a document from the database
     * @param {string} imageID The database identifer for the image
     * @returns {Promise<?{successful: boolean, result: ImageInfo}>} The data about the image with the given id
     */
    async getData(imageID)
    {
        return await get(`${this.#url}/getData`, { id: imageID });
    }

    /**
     * Removes an image from the database
     * @param {string} imageID The database identifer for the image
     * @returns {Promise<?{successful: boolean, result: boolean}>} If the image was removed
     */
    async remove(imageID)
    {
        return await remove(`${this.#url}/remove`, { id: imageID });
    }
}

export default ImagesCommunication;