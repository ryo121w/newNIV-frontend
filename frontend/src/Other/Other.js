import React from 'react';
import FindPeak from './FindPeak';
import styles from './css/Other.module.css';
import SmoothingComponent from './SmoothingComponent';

function Other() {
    return (
        <div className={styles['Other-container']}>
            <h2 className={styles['title']}>Other Analysis</h2>

            {/* FindPeak コンポーネントを表示 */}
            <FindPeak />

            {/* 今後、他の関連するコンポーネントや機能をここに追加できます */}
            <SmoothingComponent />
        </div>
    );
}

export default Other;