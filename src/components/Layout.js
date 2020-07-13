import React from "react";
import { Switch, Route } from "react-router-dom";
import routes from "../routes";
import Header from './Header';
import './Layout.css';

class Layout extends React.Component {
    constructor() {
        super();
        this.state = {
            title: "Welcome to React SSR!",
        };
    }

    render() {
        return (
            <div className="App container">
                <div className="main-container">
                    <Header />
                    <Switch>
                        { routes.map( route => <Route key={ route.path } { ...route } /> ) }
                    </Switch>
                </div>
            </div>    
        );
    }
}

export default Layout;
