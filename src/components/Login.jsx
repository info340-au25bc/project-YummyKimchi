import React, { useState } from "react";
import { Link, useNavigate } from 'react-router';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { motion } from "motion/react"

export function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const logins = props.logins;

    let reactButton = props.buttonReact;
    let navigate = useNavigate();

    const handleClick = (event) => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, username, password)
            .then((data) => {
                reactButton();
                navigate('/login');
            })
            .catch((error) => {
                navigate('/login');
            })

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
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="login-box flex-column">
            <div className="flex-column subsection">
                <p>Please log in!</p>
            </div>
            <form>
                <div className="flex-column subsection">
                    <div className="flex-column submission-box">
                        <label htmlFor="userInput">Email</label>
                        <input type="text" id="userInput" name="Your email" onChange={handleUser} value={username} />
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
        </motion.div>
    )
}