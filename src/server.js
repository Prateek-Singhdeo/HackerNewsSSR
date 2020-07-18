import express from "express";
import path from "path";
import React from "react";
import serialize from "serialize-javascript";
import { renderToString } from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import cookieParser from 'cookie-parser';
import routes from "./routes";
import Layout from "./components/Layout";
import reducers from "./store/reducers/fetchdataReducer";
import { createStore, applyMiddleware } from "redux";
import { Helmet } from 'react-helmet';
import thunk from "redux-thunk";
import * as actionTypes from './store/actions/actionTypes';

const app = express();
app.use(cookieParser())
app.use( express.static( path.resolve( __dirname, "../dist" ) ) );
app.use("/public" ,express.static(path.resolve(__dirname, "../public")));

app.get( "/*", ( req, res ) => {
    const context = { };
    const store = createStore( reducers, applyMiddleware( thunk ) );
    console.log('here');
    let hiddenIds = [];
    let upvotedIds = {};
    if(req.cookies.hidden) {
        hiddenIds = JSON.parse(req.cookies.hidden);
    }
    if(req.cookies.upvotes) {
        upvotedIds = JSON.parse(req.cookies.upvotes);
    }
    let pageNumb = req.query.p ? Number(req.query.p) : 0;
    const dataRequirements =
        routes
            .filter( route => matchPath( req.url, route ) ) // filter matching paths
            .map( route => route.component ) // map to components
            .filter( comp => comp.serverFetch ) // check if components have data requirement
            .map( comp => store.dispatch(comp.serverFetch(pageNumb)) ); // dispatch data requirement

    Promise.all( dataRequirements ).then( ( ) => {
        let allData = store.getState(); 
        let hiddenData = allData.fetchData.data.hits.filter((item) => {
            if(upvotedIds[item.objectID]) {
                item.points = upvotedIds[item.objectID];
            }
            return hiddenIds.indexOf(item.objectID) == -1;
        });

        let updatedState = {
            ...allData,
            fetchData: {
               ...allData.fetchData,
               data: {
                ...allData.fetchData.data,
                hits: hiddenData
               }
            }
        }
        store.dispatch({type:actionTypes.RESET_DATA, payload: updatedState.fetchData});
        
        const jsx = (
            <ReduxProvider store={ store }>
                <StaticRouter context={ context } location={ req.url }>
                    <Layout />
                </StaticRouter>
            </ReduxProvider>
        );
        const reactDom = renderToString( jsx );
        const reduxState = store.getState( );
        const helmet = Helmet.renderStatic();

        res.writeHead( 200, { "Content-Type": "text/html" } );
        res.end( htmlTemplate( reactDom, reduxState, helmet) );
    } );
} );


app.listen( 3000 );

function htmlTemplate( reactDom, reduxState, helmet) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            ${helmet.meta.toString()}
            <link rel="icon" href="/public/favicon.ico" />
            <link rel="stylesheet" type="text/css" href="./styles.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        </head>
        
        <body>
            <div id="app">${ reactDom }</div>
            <script>
                window.REDUX_DATA = ${ serialize( reduxState, { isJSON: true } ) }
            </script>
            <script src="./bundle.js"></script>
        </body>
        </html>
    `;
}
