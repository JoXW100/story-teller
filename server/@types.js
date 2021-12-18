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
 * @typedef DBFolderFileContent
 * @type {{}}
 */

/**
 * @typedef DBDocumentFileContent
 * @property {string} text
 * @property {{
 *      title: string,
 *      shortText: string,
 *      fullName: string
 *  }} data
 */

/**
 * @typedef DBFile
 * @property {ObjectID} _id
 * @property {ObjectID} storyID
 * @property {ObjectID} holderID
 * @property {string} name
 * @property {string} type
 * @property {DBFolderContent | DBDocumentFileContent} content
 * @property {number} dateCreated
 * @property {number} dateUpdated
 */

/**
 * @typedef DBAsset
 * @property {ObjectID} _id
 * @property {ObjectID} documentID
 * @property {ObjectID} fileID
 * @property {string} name
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
 * @typedef DBFileUpdateValues
 * @property {?ObjectID} holderID
 * @property {?string} name
 * @property {?DBFileContent} content
 */

/**
 * @typedef DBAssetUpdateValues
 * @property {?string} description
 */