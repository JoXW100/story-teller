

class DocumentFunctions
{
    /** 
     * @param {[String]} content to search
     * @param {String} defaultKey  The key when none is given
     * @returns {{ String: value }} The args
    */
    static contentToArgs = (content, defaultKey = "default") => 
    {
        let itemIndex = content.findIndex((value) => typeof(value) === "string" && value.match(/\[(.*?)\]/));
        let [argTexts, rest] = this.#getArgs(content[itemIndex]);
        let value = {};
        if (argTexts) 
        {
            content[itemIndex] = rest;
            let subArgs = argTexts.match(/{.*?}/g);
            subArgs?.forEach((arg, index) => 
            {
                argTexts = argTexts.replace(arg, `@(${index})`);
                subArgs[index] = this.contentToArgs([`[${arg.substring(1, arg.length - 1)}]`]);
            });

            let parts = argTexts.split(',');
            parts.forEach(text => 
            {
                let [key, arg] = text.split(/:(?!.\/)/g);
                if (!arg)
                {
                    arg = key;
                    key = defaultKey;
                }
                let match = arg.match(/(?<=@\().*?(?=\))/g);

                arg = match ? subArgs[match[0]] : arg.trim();
                
                value[key.trim()] = arg;
            });
        }

        return value;
    }

    /**
     * @param {string} text 
     * @returns {[args: string, rest: string]}
     */
    static #getArgs = (text) => 
    {
        let indexes = [];
        let reg = /[\[\]]/g;
        let match;
        while (match = reg.exec(text))
        {
            indexes.push(match.index)
        }
        if (indexes.length < 2) return [null, text];

        let args = text.slice(indexes[0] + 1, indexes[indexes.length - 1]).trim()
        let rest = text.slice(0, indexes[0]) + text.slice(indexes[indexes.length - 1], text.length - 1).trim();
        return [args, rest]
    }

    /** 
     * @param {Number} dice The size of the dice
     * @param {Number} num  The number of dice
     * @returns {[Number]} The numbers rolled
    */
    static roll = (dice, num) => 
    {
        if (dice < 1 || num < 1) return 0;
        let rolls = new Array(num);
        for (let index = 0; index < num; index++) {
            rolls[index] = Math.floor(Math.random() * dice) + 1;
        }
        return rolls;
    }
}

export default DocumentFunctions;