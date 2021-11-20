

class DocumentFunctions
{
    static contentToArgs = (content, defaultKey) => {
        let itemIndex = content.findIndex((value) => typeof(value) === "string" && value.match(/\[(.*?)\]/));
        let argTexts = content[itemIndex]?.split(/\[(.*?)\]/)[1];
        if (argTexts) 
        {
            content[itemIndex] = content[itemIndex]?.replace(`[${argTexts}]`, "").trim();

            return argTexts?.split(',').reduce((collection, elem) => {
                if (!elem) return collection;
                let [key, value] = elem.split(':');
                return value ? {...collection, [key.trim()]: value.trim() } 
                             : {...collection, [defaultKey]: key.trim() };
            }, {});
        }

        return {};
    }
}

export default DocumentFunctions;