import fetch from "isomorphic-fetch";
import * as actionTypes from './actionTypes';

export const fetchNewsFailed = () => {
    return {
        type: actionTypes.FETCH_NEWS_FAILED
    };
};
export const updatePageNum = (page) => {
    return {type: actionTypes.UPDATE_PAGENUM, payload:page}
}
export const modifyData = (data) => {
    return {type: actionTypes.MODIFY_DATA, payload: data};
}
export const setData = (data) => {
    return {type: actionTypes.FETCH_DATA, payload:data}
}
export const getData = (page=0) => {
    return (dispatch) => {
            const BASE_URL = "https://hn.algolia.com/api/v1/search?";
            let url;
            if(page) {
                url = BASE_URL+'page='+page;   
            }
            else{
                    url = BASE_URL+'tags=front_page';
            }  
            dispatch({type:actionTypes.LOADING_INDICATOR, payload:true}); 
            return fetch(url)
                .then(res=> res.json())
                .then(data=> {
                    dispatch(setData(data));
                    dispatch({type:actionTypes.LOADING_INDICATOR, payload: false});
                })
                .catch(err => dispatch(fetchNewsFailed()))
        
    }        

}

export const fetchData = ( ) => ( dispatch ) =>
    fetchCircuits( ).then( res => dispatch( storeData( res ) ) );