import React, { useState } from "react";
import { useNavigate } from "react-router";
import { getAuth, signOut } from "firebase/auth";
import { motion } from "motion/react"

export function LoggedIn(props) {
    let reactButton = props.buttonReact;
    let navigate = useNavigate();

    const handleButton = (event) => {
        event.preventDefault();
        const auth = getAuth();
        signOut(auth)
            .then((data) => {
                reactButton();
                navigate('/login');
            })
    }

    return (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="login-box flex-column">
            <div className="flex-column subsection">
                <p>You are logged in.</p>
            </div>
            <div className="submission-box subsection"><button type="button" onClick={handleButton}>Logout</button></div>
        </motion.div>
    )
}