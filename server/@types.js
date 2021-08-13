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
 * @typedef StoryFile
 * @property {string} name
 * @property {string} filetype // "doc" | "folder"
 * @property {[StoryFile]} content
 */

/**
 * @typedef StoryDocument
 * @property {string} _id
 * @property {*} data
 * @property {number} dateCreated
 * @property {number} dateUpdated
 */