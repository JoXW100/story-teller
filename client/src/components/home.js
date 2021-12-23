import React, { useContext, useEffect, useState } from 'react';
import Server from '../server/server';
import { Context } from './appContext';
import Button, { ButtonType } from './button';
import Popup from './popup';

const Home = ({ history }) => 
{
    const { data } = useContext(Context);
    const [lastStory, setLastStory] = useState(undefined);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("My Story");

    const showPopup = () => {
        setShow(true);
        setName("My Story");
    }

    const createStory = () => {
        setShow(false);

        Server.stories.add(name)
        .then((response) => response && history.push(`stories/${response.result}`))
        .catch(console.error());
    }

    const nameIsValid = () => {
        return name !== "";
    }

    useEffect(() => {
        let storyID = localStorage.getItem(data.storageKeys.lastStory);
        if (storyID && storyID !== "undefined")
        {
            Server.stories.get(storyID)
            .then((response) => response && setLastStory(response.result))
            .catch((error) => console.error(error));
        }
        
    }, [data.storageKeys.lastStory]);

    return (
        <div className="AppBody">
            <img className="MainImage" alt="logo" src={'logo512.png'}/>
            <Popup 
                enabled={show} 
                title={"Name your story"}
                close={() => setShow(false)}
            >
                <input value={name} onChange={(value) => setName(value.target.value)}/>
                <Button
                    disabled={!nameIsValid(name)}
                    onClick={createStory}
                    type={ButtonType.SmallRound}
                > 
                    Create Story 
                </Button>
            </Popup>

            <div className="OptionContainer">
                <Button 
                    disabled={!lastStory} 
                    to={`stories/${localStorage.getItem(data.storageKeys.lastStory)}`}
                >
                    Open Last Story 
                </Button>
                <Button to={"/select"}> Open Story </Button>
                <Button onClick={showPopup}>  
                    Create Story 
                </Button>
            </div>
        </div>
    );
}


export default Home;