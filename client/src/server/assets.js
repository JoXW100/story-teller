import { get, remove, postFile, getFile } from "./server";

class AssetsCommunication
{
    #url;

    constructor(url)
    {
        this.#url = `${url}/assets`;
    }

    /**
     * Adds an image to the database
     * @param {File} file
     * @returns {Promise<?{successful: boolean, result: string}>} The id of the image or null
     */
    async add(file, documentID, type, description)
    {
        let data = new FormData();
        data.append("file", file)
        data.append("data", JSON.stringify({
            name:       file.name,
            documentID: documentID,
            type: type,
            description: description
        }))
        return await postFile(`${this.#url}/add`, data);
    }

    /**
     * Gets a file from the database
     * @param {string} imageID
     * @returns {Promise<?DBAsset>} The id of the document or null
     */
    async get(imageID)
    {
        return await get(`${this.#url}/get`, { id: imageID });
    }

    /**
     * Gets the ids of related assets
     * @param {string} documentID
     * @returns {Promise<?[DBAsset]>} The id of the document or null
     */
    async getRelated(documentID)
    {
        return await get(`${this.#url}/getRelated`, { id: documentID });
    }

    /**
     * Gets a file from the database
     * @param {string} fileID
     * @returns {Promise<?Blob>} The id of the document or null
     */
    async getFile(fileID)
    {
        return await getFile(`${this.#url}/getFile`, { id: fileID });
    }

    /**
     * Gets a document from the database
     * @param {string} fileID The database identifier for the image
     * @returns {Promise<?{successful: boolean, result: ImageInfo}>} The data about the image with the given id
     */
    async getData(fileID)
    {
        return await get(`${this.#url}/getData`, { id: fileID });
    }

    /**
     * Removes an image from the database
     * @param {string} imageID The database identifier for the image
     * @returns {Promise<?{successful: boolean, result: boolean}>} If the image was removed
     */
    async remove(fileID)
    {
        return await remove(`${this.#url}/remove`, { id: fileID });
    }
}

export default AssetsCommunication;