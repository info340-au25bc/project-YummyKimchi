import React, { useState } from "react";
import { useNavigate } from "react-router";

export function LoggedIn(props) {
    let reactButton = props.buttonReact;
    let navigate = useNavigate();

    const handleButton = (event) => {
        event.preventDefault();
        reactButton();
        navigate('/login');
    }

    return (
        <div className="login-box flex-column">
            <div className="flex-column subsection">
                <p>You are logged in.</p>
            </div>
            <div className="submission-box subsection"><button type="button" onClick={handleButton}>Logout</button></div>
        </div>
    )
}