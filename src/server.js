import express from "express";
import path from "path";

import React from "react";
import serialize from "serialize-javascript";
import { renderToString } from "react-dom/server";
import { StaticRouter, matchPath } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import Helmet from "react-helmet";
import routes from "./routes";
import Layout from "./components/Layout";
import reducers from "./store/reducers/fetchdataReducer";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const app = express();

app.use( express.static( path.resolve( __dirname, "../dist" ) ) );

app.get("/vote", (req, res) => {

    
})
app.get( "/*", ( req, res ) => {
    const context = { };
    const store = createStore( reducers, applyMiddleware( thunk ) );
    console.log(req.query.cookies);
    let pageNumb = req.query.p ? Number(req.query.p) : 0;
    const dataRequirements =
        routes
            .filter( route => matchPath( req.url, route ) ) // filter matching paths
            .map( route => route.component ) // map to components
            .filter( comp => comp.serverFetch ) // check if components have data requirement
            .map( comp => store.dispatch( comp.serverFetch(pageNumb ) ) ); // dispatch data requirement

    Promise.all( dataRequirements ).then( ( ) => {
        const jsx = (
            <ReduxProvider store={ store }>
                <StaticRouter context={ context } location={ req.url }>
                    <Layout />
                </StaticRouter>
            </ReduxProvider>
        );
        const reactDom = renderToString( jsx );
        const reduxState = store.getState( );
        const helmetData = Helmet.renderStatic( );

        res.writeHead( 200, { "Content-Type": "text/html" } );
        res.end( htmlTemplate( reactDom, reduxState, helmetData ) );
    } );
} );


app.listen( 3000 );

function htmlTemplate( reactDom, reduxState, helmetData ) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            ${ helmetData.title.toString( ) }
            ${ helmetData.meta.toString( ) }
            <title>React SSR</title>
            <link rel="stylesheet" type="text/css" href="./styles.css" />
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
