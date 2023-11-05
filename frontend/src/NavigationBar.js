import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NavigationBar.module.css';  // CSSモジュールをインポートする

function NavigationBar() {
    return (
        <nav className={styles.navbar}>
            <Link to="/static" className={styles.navItem}>HOME</Link>
        </nav>
    );
}

export default NavigationBar;
