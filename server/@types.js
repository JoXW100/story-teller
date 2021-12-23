// -------------------
// DATABASE MAIN TYPES
// -------------------

/**
 * @typedef DBStory
 * @property {ObjectID} _id
 * @property {string} name
 * @property {string} description
 * @property {?ObjectID} defaultDocument
 * @property {number} dateCreated
 * @property {number} dateUpdated
 */

/**
 * @typedef DBFile
 * @property {ObjectID} _id
 * @property {ObjectID} storyID
 * @property {ObjectID} holderID
 * @property {string} name
 * @property {string} type
 * @property { DBFolderFileContent|DBDocumentFileContent|DBCreatureFileContent} content
 * @property {number} dateCreated
 * @property {number} dateUpdated
 */

/**
 * @typedef DBAsset
 * @property {ObjectID} _id
 * @property {ObjectID} documentID
 * @property {ObjectID} assetFileID
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

// -------------------
// DATABASE UPDATE TYPES
// -------------------

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

// ----------------------
// DATABASE CONTENT TYPES
// ----------------------

/**
 * @typedef DBFolderFileContent
 * @type {{}}
 */

/**
 * @typedef DBDocumentFileContent
 * @property {string} text
 * @property {string} title
 * @property {string} shortText
 */

/**
 * @typedef DBCreatureFileContent
 * @property {string} name
 * @property {string} shortText
 * @property {string} text
 * @property {string} type
 * @property {string} size
 * @property {string} alignment
 * @property {ObjectID} portraitID
 * @property {CreatureStats} stats
 * @property {[ObjectID]} abilities
 * @property {CreatureSpells} spells
 */

/**
 * @typedef DBAbilityFileContent
 * @property {string} name
 * @property {string} shortText
 * @property {string} text
 * @property {string} notes
 * @property {string} abilityType // Ranged Attack, Melee Weapon, none
 * @property {string} actionType // action / bonus / special...
 * @property {number} charges // -1 for infinite
 * @property {string} chargeReset // none / short rest / long rest / dawn / noon
 * @property {HitCondition} roll
 * @property {AbilityEffectDetails} effect
 */

/**
 * @typedef DBSpellContent
 * @property {string} name
 * @property {string} text
 * @property {number} level // Cantrips are 0
 * @property {string} castingTime
 * @property {string} duration
 * @property {string} school
 * @property {[string]} components
 * @property {HitCondition} roll
 * @property {SpellEffectDetails} effect
 */

// --------------------------
// CONTENT SUB TYPES CREATURE
// --------------------------

/**
 * @typedef CreatureStats
 * @property {number} level
 * @property {number} hitDice
 * @property {number} armor
 * @property {CreatureAttributes} attributes
 * @property {CreatureAttributes} savingThrows
 * @property {CreatureSpeed} speed
 * @property {[string]} senses
 * @property {[string]} languages
 * @property {[string]} resistances
 * @property {[string]} immunities
 * @property {[string]} advantages
 * @property {[string]} disadvantages
 * @property {string} challenge
 */

/**
 * @typedef CreatureAttributes
 * @property {number} str
 * @property {number} dex
 * @property {number} con
 * @property {number} int
 * @property {number} wis
 * @property {number} cha
 */

/**
 * @typedef CreatureSpeed
 * @property {number} walk
 * @property {number} swim
 * @property {number} fly
 * @property {number} burrow
 */

/**
 * @typedef CreatureSpells
 * @property {string} casterType // none / int / cha
 * @property {[number]} spellSlots
 * @property {[ObjectID]} spellIDs
 */

/**
 * @typedef AbilityEffectDetails
 * @property {string} type // buff / control / fire / slashing
 * @property {string} range
 * @property {string} successEffect
 * @property {string} failEffect
 * @property {HitCondition} roll
 */

/**
 * @typedef HitCondition
 * @property {string} scalingModifier // dex / str / none
 * @property {number} proficiency // multiplied with proficiency
 * @property {number} baseModifier
 * @property {number} diceSize
 * @property {number} diceNum
 */

/**
 * @typedef SpellEffectDetails
 * @property {string} type //   buff / control / fire  / psychic
 * @property {string} attack // none / self    / melee / ranged
 * @property {string} area //   none / cube    / cone  / radius
 * @property {number} range
 * @property {string} successEffect
 * @property {string} failEffect
 * @property {HitCondition} roll
 */