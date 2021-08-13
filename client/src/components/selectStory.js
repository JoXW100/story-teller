import React, { useEffect, useState } from 'react';
import Server from '../server/server';
import Button, { ButtonType } from './button';
import '../styles/textGroup.css';

const SelectStory = () => 
{
    /** @type {[stories: [string], setStories: React.Dispatch<React.SetStateAction<[string]>>]} */
    const [stories, setStories] = useState([]);

    useEffect(() => 
    {
        Server.stories.getAll()
        .then((response) => response && setStories(response.result))
        .catch(console.error());
    }, [])

    /**
     * Removes a story from the database and then reloads
     * @param {Story} story The story to remove
     */
    const remove = (story) => 
    {
        Server.stories.remove(story._id)
        .then((response) => 
        {
            story.files.forEach((file) => removeHelper(file));

            Server.documents.remove(story.introduction.content)
            .catch(console.error());

            if (response && response.result)
            {
                Server.stories.getAll()
                .then((response) => response && setStories(response.result))
                .catch(console.error());
            }
        })
        .catch(console.error());
    }

    /**
     * @param {StoryFile} file
     */
    const removeHelper = (file) => 
    {
        if (file.filetype !== "folder")
        {
            Server.documents.remove(file)
            .catch(console.error());
        }
        else 
        {
            file.content.forEach((file) => removeHelper(file));
        }
    }

    return (
        <div className="AppBody">
            <div className="AppTitle">
                Select Story
            </div>
            {Object.values(stories).map((story, index) => 
                <StoryItem  id={story} key={index} remove={remove}/>
            )}
        </div>
    );
}

const StoryItem = ({ id, remove }) => 
{
    /** @type {[story: StoryDB, setStory: React.Dispatch<React.SetStateAction<[StoryDB]>>]} */
    const [story, setStory] = useState(undefined);

    useEffect(() => 
    {
        Server.stories.get(id)
        .then((response) => response && setStory(response.result))
        .catch(console.error());
    }, [id])

    return (
        <div className="buttonHolder">
            { story &&
                <>
                    <Button
                        onClick={() => null}
                        to={`/stories/${id}`}
                    >
                        <div className="textGroup">
                            <div className="textGroupBig"> {story.name} </div>
                            <div className="textGroupSmall">
                                
                                {`Last Updated: ${new Date(story.dateUpdated).toLocaleDateString("se-SE", { hour: '2-digit', minute: '2-digit' })}`} 
                            </div>
                        </div>
                    </Button>
                    <Button
                        onClick={() => remove(story)}
                        type={ButtonType.Last}
                    >
                        Remove
                    </Button>
                </>
            }
        </div>
    );
}

export default SelectStory;