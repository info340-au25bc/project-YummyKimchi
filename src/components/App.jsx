import React, { useState } from 'react';
import { FrontPage } from './FrontPage';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Login } from './Login';
import { SignUp } from './SignUp';
import { LoggedIn } from './LoggedIn';
import { InventoryPage } from './InventoryPage';
import { OutfitBuilderPage } from './main-builder';
 
import logins from '../data/logins.json';
import clothes from '../data/exampleClothing.json';
import clothes2 from '../data/clothes.js';

function App(props) {
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLogIn = (event) => {
        // if the user is logged in and this function is passed, it will be set to false as it will have been sent in the sign out.
        // If the user is false and this function is called, it will be set to true as verification in the login.jsx will have passed.
        if (loggedIn) {
            setLoggedIn(false);
        } else {
            setLoggedIn(true);
        }
    }

    return (
        // Nav Bar and Header
        <div className='grid'>
            <header>
                <nav>
                    <div className="app-home"><Link to='/home'>HOME</Link></div>
                    <div className="more-menu">
                        <Link to='/inventory'><img src="/img/inventory.png" className="menu-pic" /></Link>
                        <Link to = '/main-builder'> <img src="/img/outfit-builder.png" className="menu-pic" /> </Link>
                        <Link to='/loggedIn'><img src="/img/account.png" className="menu-pic" /></Link>
                    </div>
                    <ul className="app-links">
                        <li><Link to='/inventory'>INVENTORY</Link></li>
                        <li><Link to ='/main-builder'>OUTFIT BUILDER</Link></li>
                        <li><Link to='/loggedIn'>ACCOUNT</Link></li>
                    </ul>
                </nav>
            </header>
            <main>
                <Routes>
                    {/* Home Page Routing */}
                    <Route path='home' element={<FrontPage />} />
                    <Route path='*' element={<Navigate to='/home' />} />

                    {/* Login Page Routing */}
                    <Route path='login' element={loggedIn ? <Navigate to='/loggedIn'/> : <Login logins={logins} buttonReact={handleLogIn} />} />
                    <Route path='signUp' element={<SignUp />} />
                    <Route path='loggedIn' element={loggedIn ? <LoggedIn buttonReact={handleLogIn} /> : <Navigate to='/login' />} />

                    {/* Inventory Page Routing */}
                    <Route path='inventory' element={<InventoryPage clothingList={clothes} />} />

                    <Route path= 'main-builder' element={<OutfitBuilderPage clothingList ={clothes2} /> }/>
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
};

export default App;