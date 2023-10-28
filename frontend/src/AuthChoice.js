import React from 'react';

function AuthChoice({ onChoice }) {
    return (
        <div>
            <h2>Welcome to Our App</h2>
            <p>Please choose an action:</p>
            <button onClick={() => onChoice('login')}>Login</button>
            <button onClick={() => onChoice('signup')}>Signup</button>
            {/* スーパーユーザー用のログインボタンを追加 */}
            <button onClick={() => onChoice('superuser-login')}>SuperUser Login</button>
        </div>
    );
}

export default AuthChoice;
