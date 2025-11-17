import React from 'react';
import { FrontPage } from './FrontPage';
import { Routes, Route, Navigate, Link } from 'react-router';

function App(props) {
    return (
        // Nav Bar and Header
        <div>
            <header>
                <nav>
                    <div className="app-home"><a href="#">HOME</a></div>
                    <div className="more-menu"><a href="#"><img src="/img/menu.png" className="menu-pic" /></a></div>
                    <div className="app-links">
                        <ul>
                            <li><a href="#">INVENTORY</a></li>
                            <li><a href="#">OUTFIT BUILDER</a></li>
                            <li><a href="#">ACCOUNT</a></li>
                        </ul>
                    </div>
                </nav>
            </header>
            <main>
                <Routes>
                    <Route path='home' element={<FrontPage />} />
                    <Route path='*' element={<Navigate to='/home' />} />
                </Routes>
            </main>
            <footer>
                <div className="flex-container footer">
                    <p>Copyright © 2025</p>
                    <p><a href="mailto:email@shirt.uw.edu">email@shirt.uw.edu</a></p>
                    <p><a href="tel:111-222-3333">111-222-3333</a></p>
                </div>
            </footer>
        </div>
    )
}

export default App;