import React, { useState } from "react";
import { Link, useNavigate } from 'react-router';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export function SignUp(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    let navigate = useNavigate();
    const auth = getAuth();
    let reactButton = props.buttonReact;

    const handleClick = (event) => {
        // Update Login list, somehow.
        event.preventDefault();
        if (password.length < 6) {
            navigate('/signup');
        }
        createUserWithEmailAndPassword(auth, username, password)
            .then((data => {
            reactButton();
            navigate('/loggedIn');
            }))
            .catch((error)  => {
                if (error.code === "auth/email-already-in-use") {
                    setErrorMessage("That email is already registered. Try logging in instead.");
                } else if (error.code === "auth/invalid-email") {
                    setErrorMessage("Please enter a valid email address.");
                } else {
                    setErrorMessage("Sign-up failed. Please try again.");
                }
            });
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
                <p>Please choose a unique Email and Password (6 characters at minimum) to sign up!</p>
                {errorMessage && <p className="error">{errorMessage}</p>}
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