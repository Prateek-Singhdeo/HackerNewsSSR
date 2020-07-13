import React from 'react';
import './newstitle.css'
import { parse } from 'url';

const NewsTitle = ({url,index,title,vote}) => {
    return(
    
        <div className="title-container">
            <div className="heading">
                <div className="index">{`${index+1}.`}</div>
                <div className="votearrow" onClick={vote}></div>
                <div className="title"><a href={url}>{title}</a></div>
            </div>
            {url && (
                <div className="sitebit comhead">
                    {' '}
                    (
                    <a href={`from?site=${url.hostname}`}>
                        <span className="sitestr">{parse(url).hostname}</span>
                    </a>
                    )
                </div>
            )}
            
        </div>    
    )
}

export default NewsTitle;