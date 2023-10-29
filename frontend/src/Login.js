import React, { useState } from 'react';
import styles from './Login.module.css';  // Assuming the CSS module is named Login.module.css

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();

        const apiUrl = `${BACKEND_URL}login/`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (response.status === 200) {
                onLogin(true);
            } else {
                console.error("Login failed:", data.message);
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error("API request failed:", error);
            setErrorMessage("An error occurred while trying to log in.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <span className={styles.card__title}>Login</span>
                <p className={styles.card__content}>Enter your credentials to access your account.</p>
                <div className={styles.card__form}>
                    <div>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Your Username"
                            required
                        />
                    </div>
                    <div>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    <button className={styles.signUp} onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
