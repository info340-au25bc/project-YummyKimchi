import React from "react";

export function LoginPage() {
    return (
    <div className="login-box flex-column">
        <div className="flex-column subsection">
            <p>Please log in!</p>
        </div>
        <form action="login.html" method="GET">
            <div className="flex-column subsection">
                <div className="flex-column submission-box">
                    <label for="userInput">Username</label>
                    <input type="text" id="userInput" name="Your username..." />
                </div>
                <div className="flex-column submission-box">
                    <label for="passwordInput">Password</label>
                    <input type="text" id="passwordInput" name="Your password..." />
                </div>
                <div className="flex-column submission-box"><button type="submit">Submit</button></div>
            </div>
        </form>
        <div className="subsection">
            <p><a href="">Sign up</a> if you don't have an account!</p>
        </div>
    </div>
    )
}