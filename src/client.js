import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import Layout from "./components/layout";
import "./App.css";

import reducers from "./store/reducers/fetchdataReducer";


const store = createStore( reducers, window.REDUX_DATA, applyMiddleware( thunk ) );

const jsx = (
    <ReduxProvider store={ store }>
        <Router>
            <Layout />
        </Router>
    </ReduxProvider>
);
const app = document.getElementById( "app" );

ReactDOM.hydrate( jsx, app );

