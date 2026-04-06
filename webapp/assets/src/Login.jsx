import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login({ onLogin }) {
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        if (!userName.trim()) return;

        setLoading(true);
        try {
            const requestOptions = {method: 'GET'}
            const response = await fetch('/connectionGame/login.action?username='+userName, requestOptions);

            //console.log(response.status);

            if (!response.ok) { console.log(response.status); return; }
            //console.log("response received : " , response);

            const resp = await response.json();
            const user = resp.user;

            //console.log("After extracting : ", user);
            onLogin(user);
            navigate("/connectionGame/game");
        } catch(err) {
            console.log("Error : " , err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login">
            <h2>Connections</h2>
            <form onSubmit={handleLogin}>
                <input type="text" id="username" placeholder="Enter Username " value={userName} onChange={(e) => {setUserName(e.target.value)}} />
                <button type="submit" id="login-btn" disabled={loading}>{loading ? " Loading..." : " Play Game "}</button>
            </form>
        </div>
    );
}

