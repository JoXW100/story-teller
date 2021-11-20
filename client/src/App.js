import './App.css';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { AppContext } from './components/appContext';
import Home from './components/home';
import SelectStory from './components/selectStory';
import StoryMenu from './components/storyMenu';
import { TimedPopupController } from './components/timedPopup/timedPopupController';

const Header = () => {
    return (
        <div className="AppHeader">
            <Link className="AppHeaderItem" to="/">Home</Link>
            <Link className="AppHeaderItem" to="/select">Stories</Link>
        </div>
    );
}

const App = () => {

    window.dragData = {};

    return (
        <AppContext>
            <TimedPopupController>
                <div className="App">
                    <BrowserRouter>
                        <Header/>
                        <Switch>
                            <Route exact path="/"
                                render={props => <Home {...props}/>}
                            />
    
                            <Route exact path="/stories/:key"
                                render={props => <StoryMenu {...props}/>}
                            />
    
                            <Route exact path="/stories/:key/:doc"
                                render={props => <StoryMenu {...props}/>}
                            />
    
                            <Route exact path="/stories/:key/:doc/:editMode"
                                render={props => <StoryMenu {...props}/>}
                            />
    
                            <Route exact path="/select"
                                render={props => <SelectStory {...props}/>}
                            />
                        </Switch>
                    </BrowserRouter>
                </div>
            </TimedPopupController>
        </AppContext>
    );
}

export default App;
