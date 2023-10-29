// WaitingForApproval.js
import React from 'react';
import styles from './WaitingForApproval.module.css'; // CSSモジュールをインポート

function WaitingForApproval() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Thank you for signing up!</h2>
                <p className={styles.content}>We are currently reviewing your registration. You'll be notified once your account has been approved.</p>
            </div>
        </div>
    );
}

export default WaitingForApproval;
