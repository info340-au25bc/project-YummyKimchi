import React, { useState } from "react";
import { Link, useNavigate } from 'react-router';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export function SignUp(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();
    const auth = getAuth();

    const handleClick = (event) => {
        // Update Login list, somehow.
        event.preventDefault();
        createUserWithEmailAndPassword(auth, username, password)
        navigate('/home');
    }

    const handleUser = (event) => {
        let newValue = event.target.value;
        setUsername(newValue);
    }   

    const handlePassword = (event) => {
        let newValue = event.target.value;
        setPassword(newValue);
    }

    return (
        <div className="login-box flex-column">
            <div className="flex-column subsection">
                <p>Please choose an Email and Password (6 characters at minimum) to sign up!</p>
            </div>
            <form action="login.html" method="GET">
                <div className="flex-column subsection">
                    <div className="flex-column submission-box">
                        <label htmlFor="userInput">Email</label>
                        <input type="text" id="userInput" name="Your email" onChange={handleUser} value={username} />
                    </div>
                    <div className="flex-column submission-box">
                        <label htmlFor="passwordInput">Password</label>
                        <input type="password" id="passwordInput" name="Your password" onChange={handlePassword} value={password} />
                    </div>
                    <div className="flex-column submission-box"><button onClick={handleClick}>Submit</button></div>
                </div>
            </form>
        </div>
    )
}