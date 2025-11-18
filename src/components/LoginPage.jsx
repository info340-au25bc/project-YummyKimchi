import React from "react";
import { Outlet } from "react-router";

export function LoginPage(props) {
    const [doLogin, setDoLogin] = useState(false);
    
    const handleSubmit = (event) => {

    }

    if (doLogin) {
        return 
    }

    return (
        <div className="login-box flex-column">
            <Outlet />
        </div>
    )
}