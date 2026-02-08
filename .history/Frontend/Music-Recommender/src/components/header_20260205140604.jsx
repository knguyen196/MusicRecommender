import React from 'react'
import './header.css'

function Header() {
    return (
        <header className="header">
            <h1>Music & Podcast Recommender</h1>
            <nav className="nav">
                <button>Recommendations</button>
                <button>Browse</button>
                <button>About</button>
            </nav>
        </header>
    );
}

export default Header;