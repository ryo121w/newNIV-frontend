import React, { useState } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Signup({ onSignup }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null); // 追加
    const [isLoading, setIsLoading] = useState(false); // 追加

    const handleSignup = async (e) => {
        e.preventDefault();

        // APIエンドポイントのURL
        const apiUrl = `${BACKEND_URL}signup/`; // 環境変数を利用

        setIsLoading(true); // ローディング状態の開始

        try {
            // APIにPOSTリクエストを送信
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

            // レスポンスをJSON形式で解析
            const data = await response.json();

            // レスポンスのステータスコードやデータ内容に基づいて条件分岐
            if (response.status === 201) {
                onSignup(true);
                // 必要に応じて、トークンの保存などの処理を追加
            } else {
                console.error("Signup failed:", data.message);
                setErrorMessage(data.message); // エラーメッセージの状態管理を追加
            }
        } catch (error) {
            console.error("API request failed:", error);
            setErrorMessage("An error occurred while trying to sign up."); // エラーメッセージの状態管理を追加
        } finally {
            setIsLoading(false); // ローディング状態の終了
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
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
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* エラーメッセージの表示 */}
                <button type="submit" disabled={isLoading}>Signup</button> {/* isLoading に基づいてボタンを無効化 */}
            </form>
        </div>
    );
}

export default Signup;