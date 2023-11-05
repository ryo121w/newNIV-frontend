import React, { useState, useEffect } from 'react';
import FindPeak from './FindPeak';
import styles from './css/Other.module.css';
import SmoothingComponent from './SmoothingComponent';
import NavigationBar from '../NavigationBar';

function Other() {

    const [scrolled, setScrolled] = useState(false);

    const handleScroll = () => {
        const offset = window.scrollY;
        if (offset > 100) {  // 200px以上スクロールしたら
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    const scrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };


    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    let navbarClasses = styles['App-Logo'];  // CSS Moduleを使用して初期値を設定

    if (scrolled) {
        navbarClasses = `${navbarClasses} ${styles.scrolled}`;  // スクロール時のクラスもCSS Moduleから取得
    }

    return (
        <div className={styles['Other-container']}>
            <div className={navbarClasses}>
                <ul>
                    <li><p><NavigationBar /></p></li>
                    <li><p onClick={() => scrollTo('Peak')}>Peak</p></li>
                    <li><p onClick={() => scrollTo('Smoothing')}>Smoothing</p></li>
                </ul>
            </div>


            {/* FindPeak コンポーネントを表示 */}
            <div id='Peak'>
                <FindPeak />
            </div>


            <div id='Smoothing'>
                {/* 今後、他の関連するコンポーネントや機能をここに追加できます */}
                <SmoothingComponent />
            </div>
        </div>
    );
}

export default Other;