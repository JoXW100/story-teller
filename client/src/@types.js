/**
 * @typedef Story
 * @property {string} _id
 * @property {string} name
 * @property {StoryFile} introduction
 * @property {[StoryFile]} files
 * @property {number} dateCreated
 * @property {number} dateUpdated
 */

/**
 * @typedef StoryFramework
 * @property {string} name
 * @property {string} short
 * @property {string} title
 * @property {string} body
 */

/**
 * @typedef StoryFile
 * @property {string} name
 * @property {string} filetype // "doc" | "folder"
 * @property {[StoryFile]} content
 */

/**
 * @typedef StoryDocument
 * @property {string} _id
 * @property {StoryFramework} data
 * @property {number} dateCreated
 * @property {number} dateUpdated
 */

/**
 * @typedef ServerResponse
 * @property {boolean} successful
 * @property {*} result
 */