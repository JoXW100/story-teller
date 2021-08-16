/** 
 * @typedef ObjectID
 * @type {string}
 */

/**
 * @typedef Story
 * @property {ObjectID} _id
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
 * @property {[ObjectID]} images
 * @property {string} title
 * @property {string} body
 */

/**
 * @typedef StoryFile
 * @property {string} name
 * @property {string} filetype doc, folder
 * @property {[StoryFile]} content ObjectID or [StoryFile]
 */

/**
 * @typedef StoryFileDocument
 * @property {string} name
 * @property {string} filetype doc, folder
 * @property {ObjectID} content ObjectID or [StoryFile]
 */

/**
 * @typedef StoryDocument
 * @property {ObjectID} _id
 * @property {StoryFramework} data
 * @property {number} dateCreated
 * @property {number} dateUpdated
 */

/**
 * @typedef ServerResponse
 * @property {boolean} successful
 * @property {*} result
 */