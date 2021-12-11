/**
 * @typedef DBStory
 * @property {string} _id
 * @property {string} name
 * @property {string} description
 * @property {?ObjectID} defaultDocument
 * @property {number} dateCreated
 * @property {number} dateUpdated
 */

/**
 * @typedef DBDocument
 * @property {ObjectID} _id
 * @property {ObjectID} storyID
 * @property {string} type
 * @property {string} filePath
 * @property {string} content
 * @property {string} data
 * @property {number} dateCreated
 * @property {number} dateUpdated
 */

/**
 * @typedef DBAsset
 * @property {ObjectID} _id
 * @property {ObjectID} documentID
 * @property {ObjectID} fileID
 * @property {string} type
 * @property {string} description
 * @property {number} dateCreated
 * @property {number} dateUpdated
 */

/**
 * @typedef DBAssetFileInfo
 * @property {string} _id
 * @property {number} length
 * @property {number} chunkSize
 * @property {string} uploadDate
 * @property {string} filename
 */

/**
 * @typedef DBStoryUpdateValues
 * @property {?string} name
 * @property {?string} description
 * @property {?ObjectID} defaultDocument 
 */

/**
 * @typedef DBDocumentUpdateValues
 * @property {?string} name
 * @property {?string} filePath
 * @property {?string} content
 * @property {?Object<string,*>} data
 */

/**
 * @typedef DBAssetUpdateValues
 * @property {?string} description
 */