import FilesCommunication from "./files";
import AssetsCommunication from "./assets";
import StoriesCommunication from "./stories";

const urlConstant = 'http://localhost:8080';

class Server
{
    static #url = urlConstant;
    static #stories     = new StoriesCommunication(this.#url);
    static #files   = new FilesCommunication(this.#url);
    static #assets  = new AssetsCommunication(this.#url);

    static get url() 
    { 
        return this.#url; 
    }

    static get stories()
    {
        return this.#stories;
    }

    static get files()
    {
        return this.#files;
    }

    static get assets()
    {
        return this.#assets;
    }
}

document.server = Server;

/**
 * @param {string} url
 * @param {Object.<string, any>} data
 * @returns {Promise<?ServerResponse>}
 */
export const put = async (url, data) => 
{
    let request = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }
    let response = await fetch(url, request);
    return response.ok ? await response.json() : null;
}

/**
 * @param {string} url
 * @param {Object.<string, any>} data
 * @returns {Promise<?ServerResponse>}
 */
export const get = async (url, data = {}) =>
{
    let params = Object.keys(data).map((key) => `${key}=${data[key]}`).join('&');
    try {
        let response = await fetch(`${url}?${params}`);
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.warn(error)
        return null;
    }
}

/**
 * @param {string} url
 * @param {Object.<string, any>} data
 * @returns {Promise<?Blob>}
 */
export const getFile = async (url, data = {}) =>
{
    let params = Object.keys(data).map((key) => `${key}=${data[key]}`).join('&');
    let response = await fetch(`${url}?${params}`);
    return response.ok ? await response.blob() : null;
}

/**
 * @param {string} url
 * @param {Object.<string, any>} data
 * @returns {Promise<?ServerResponse>}
 */
export const remove = async (url, data = {}) =>
{
    let request = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }
    let response = await fetch(url, request);
    return response.ok ? await response.json() : null;
}

/**
 * @param {string} url
 * @param {Object.<string, any>} data
 * @returns {Promise<?ServerResponse>}
 */
export const post = async (url, data = {}) =>
{
    let request = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }
    let response = await fetch(url, request);
    return response.ok ? await response.json() : null;
}

/**
 * @param {string} url
 * @param {FormData} data
 * @returns {Promise<?ServerResponse>}
 */
export const postFile = async (url, data = {}) =>
{
    let request = {
        method: 'POST',
        body: data
    }
    let response = await fetch(url, request);
    return response.ok ? await response.json() : null;
}

export default Server;