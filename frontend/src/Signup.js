import React, { useState } from 'react';
import styles from './Signup.module.css';  // Assuming the CSS module is named Signup.module.css

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Signup({ onSignup }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        const apiUrl = `${BACKEND_URL}signup/`;

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

            if (response.status === 201) {
                onSignup(true);
            } else {
                console.error("Signup failed:", data.message);
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error("API request failed:", error);
            setErrorMessage("An error occurred while trying to sign up.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <span className={styles.card__title}>Signup</span>
                <p className={styles.card__content}>Create your account to get started.</p>
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
                    <button className={styles.signUp} onClick={handleSignup} disabled={isLoading}>Signup</button>
                </div>
            </div>
        </div>
    );
}

export default Signup;
