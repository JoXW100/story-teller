

class DocumentFunctions
{
    /** 
     * @param {String} content to search
     * @param {String} defaultKey  The key when none is given
     * @returns {{ String: value }} The args
    */
    static contentToArgs = (content, defaultKey = "default") => {
        let itemIndex = content.findIndex((value) => typeof(value) === "string" && value.match(/\[(.*?)\]/));
        let argTexts = content[itemIndex]?.split(/\[(.*?)\]/)[1];
        if (argTexts) 
        {
            content[itemIndex] = content[itemIndex]?.replace(`[${argTexts}]`, "").trim();

            return argTexts?.split(',').reduce((collection, elem) => {
                if (!elem) return collection;
                let [key, value] = elem.split(/:(?!\/)/);
                return value ? {...collection, [key.trim()]: value.trim() } 
                             : {...collection, [defaultKey]: key.trim()   };
            }, {});
        }

        return {};
    }

    /** 
     * @param {Number} dice The size of the dice
     * @param {Number} num  The number of dice
     * @returns {[Number]} The numbers rolled
    */
    static roll = (dice, num) => {
        let rolls = new Array(num);
        for (let index = 0; index < num; index++) {
            rolls[index] = Math.floor(Math.random() * dice) + 1;
        }
        return rolls;
    }
}

export default DocumentFunctions;