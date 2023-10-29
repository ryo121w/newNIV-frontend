import React, { useState } from 'react';
import styles from './SuperUserLogin.module.css';  // Assuming the CSS module is named SuperUserLogin.module.css

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function SuperUserLogin({ onSuperUserLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        const apiUrl = `${BACKEND_URL}superuser-login/`;

        setIsLoading(true);

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

            if (response.status === 200 && data.status === "success") {
                onSuperUserLogin(data.user);
            } else {
                console.error("SuperUser Login failed:", data.message);
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error("API request failed:", error);
            setErrorMessage("An error occurred while trying to log in as SuperUser.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <span className={styles.card__title}>SuperUser Login</span>
                <p className={styles.card__content}>Enter your SuperUser credentials to access the admin dashboard.</p>
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
                    <button className={styles.signUp} onClick={handleLogin} disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SuperUserLogin;
