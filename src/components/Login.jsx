import React, { useState } from "react";
import { Link, useNavigate } from 'react-router';

export function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const logins = props.logins;

    let reactButton = props.buttonReact;
    let navigate = useNavigate();

    const handleClick = (event) => {
        let filteredLogins = logins.filter((object) => {
            if (object.username === username && object.password === password) {
                return true;
            }
            return false;
        })

        if (filteredLogins.length !== 0 && username !== "" && password !== "") {
            reactButton();
        }
        navigate('/login');
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
                <p>Please log in!</p>
            </div>
            <form>
                <div className="flex-column subsection">
                    <div className="flex-column submission-box">
                        <label htmlFor="userInput">Username</label>
                        <input type="text" id="userInput" name="Your username" onChange={handleUser} value={username} />
                    </div>
                    <div className="flex-column submission-box">
                        <label htmlFor="passwordInput">Password</label>
                        <input type="password" id="passwordInput" name="Your password" onChange={handlePassword} value={password} />
                    </div>
                    <div className="flex-column submission-box"><button type="button" onClick={handleClick}>Submit</button></div>
                </div>
            </form>
            <div className="subsection">
                <p><Link to='/signUp'>Sign up</Link> if you don't have an account!</p>
            </div>
        </div>
    )
}