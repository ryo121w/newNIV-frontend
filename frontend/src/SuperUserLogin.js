import React, { useState } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function SuperUserLogin({ onSuperUserLogin }) {  // 1. onLoginをonSuperUserLoginに変更
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
        <div>
            <h2>SuperUser Login</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* エラーメッセージの表示 */}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"} {/* ローディング状態に応じてボタンテキストの変更 */}
                </button>
            </form>
        </div>
    );
}

export default SuperUserLogin;
