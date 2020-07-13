import React from 'react';
import "./header.css";
const NewHeader = () => {
    return (
        <nav className="navbar">
            <a href="/">
                <img alt="logo"
                src=""
                style={{
                    border: '1px',
                    borderColor: 'white',
                    borderStyle: 'solid',
                    height: '18px',
                    width: '18px',
                }}/>
            </a>
            <ul className="nav-links">
                <li className="nav-item"><a href="/">Hacker News </a></li>
                <li className="nav-item"><a href="/">welcome|</a></li>
                <li className="nav-item"><a href="/">new|</a></li>
                <li className="nav-item"><a href="/">threds|</a></li>
                <li className="nav-item"><a href="/">pasts|</a></li>
                <li className="nav-item"><a href="/">comments|</a></li>
                <li className="nav-item"><a href="/">ask|</a></li>
                <li className="nav-item"><a href="/">show|</a></li>
                <li className="nav-item"><a href="/">jobs|</a></li>
                <li className="nav-item"><a href="/">submit|</a></li>
                <li className="nav-item signin"><a href="/">sign in</a></li>
            </ul>
        </nav>
    );
}
export default NewHeader;