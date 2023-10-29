import React from 'react';
import styles from './AuthChoice.module.css'; // CSSモジュールをインポート

function AuthChoice({ onChoice }) {
    return (
        <div className={styles.container}>
            <h2>NIV</h2>
            <p>Please choose an action:</p>
            <button className={styles.button} onClick={() => onChoice('login')}>Login</button>
            <button className={styles.button} onClick={() => onChoice('signup')}>Signup</button>
            <button className={styles.button} onClick={() => onChoice('superuser-login')}>SuperUser Login</button>
        </div>
    );
}

export default AuthChoice;
