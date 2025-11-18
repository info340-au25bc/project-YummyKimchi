import React, { useState } from "react";
import { Link, useNavigate } from 'react-router';

export function SignUp(props) {
    let navigate = useNavigate();

    const handleClick = (event) => {
        // Update Login list, somehow.
        event.preventDefault();
        navigate('/login');
    }

    return (
        <div className="login-box flex-column">
            <div className="flex-column subsection">
                <p>Please choose a Username and Password to sign up!</p>
            </div>
            <form action="login.html" method="GET">
                <div className="flex-column subsection">
                    <div className="flex-column submission-box">
                        <label htmlFor="userInput">Username</label>
                        <input type="text" id="userInput" name="Your username..." />
                    </div>
                    <div className="flex-column submission-box">
                        <label htmlFor="passwordInput">Password</label>
                        <input type="text" id="passwordInput" name="Your password..." />
                    </div>
                    <div className="flex-column submission-box"><button onClick={handleClick}>Submit</button></div>
                </div>
            </form>
        </div>
    )
}