import React from 'react';
import './newsfooter.css'

const NewsFooter = ({author,points,comments, createdAt,hide,upvotes}) => {
    return(
    <div className="footer-container subtext">
        <div>{points} points by</div>
        <div> {author}</div>
        <div>{createdAt} ago | </div>
        <div className="hide"onClick={hide}>hide |</div>
        <div>{comments} comments | </div>
        <div className="upvotes">{`${upvotes?upvotes:0} upvotes`} </div>
    </div>
    )
}

export default NewsFooter;