import { get, remove, postFile, getFile } from "./server";

class AssetsCommunication
{
    #url;

    constructor(url)
    {
        this.#url = `${url}/assets`;
    }

    /**
     * Adds an asset to the database
     * @param {File} asset The asset to store
     * @param {ObjectID} documentID The related document
     * @param {string} type The type of the asset
     * @param {string} description The description of the asset
     * @returns {Promise<?{successful: boolean, result: string}>} The id of the asset or null
     */
    async add(asset, documentID, type, description)
    {
        let data = new FormData();
        data.append("file", asset)
        data.append("data", JSON.stringify({
            name:       asset.name,
            documentID: documentID,
            type: type,
            description: description
        }))
        return await postFile(`${this.#url}/add`, data);
    }

    /**
     * Gets an asset from the database
     * @param {string} assetID
     * @returns {Promise<?{successful: boolean, result: DBAsset}>} The asset data or null
     */
    async get(assetID)
    {
        return await get(`${this.#url}/get`, { id: assetID });
    }

    /**
     * Gets the related assets from the database
     * @param {string} documentID The id of the related document
     * @returns {Promise<?{successful: boolean, result: [DBAsset]}>} The related assets or null
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
     * Removes an asset from the database
     * @param {string} imageID The database identifier for the asset
     * @returns {Promise<?{successful: boolean, result: boolean}>} If the asset was removed
     */
    async remove(assetID)
    {
        return await remove(`${this.#url}/remove`, { id: assetID });
    }
}

export default AssetsCommunication;