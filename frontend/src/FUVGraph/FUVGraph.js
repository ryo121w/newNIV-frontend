import React, { useState, useEffect } from 'react';
import FUVFileUploader from './FUVFileUploader';
import FUVFileKK from './FUVFileKK';
import SecondDerivativeGraphComponent from '../Static/Derivative/SecondDerivativeGraphComponent';
import FUVSecondDerivative from './FUVSecondDerivative';
import NavigationBar from '../NavigationBar';
import styles from './css/FUVGraph.module.css';

function FUVGraph() {
    const [fileUrl, setFileUrl] = useState(null);
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

    const handleFileUploaded = (url) => {
        setFileUrl(url);
    };

    return (
        <div>

            <div className={navbarClasses}>
                <ul>
                    <li><p><NavigationBar /></p></li>
                    <li><p onClick={() => scrollTo('KKT')}>KK Trance</p></li>
                    <li><p onClick={() => scrollTo('SecondDerivative')}>SecondDerivative</p></li>
                </ul>
            </div>


            <div id="KKT">
                {fileUrl && (
                    <div>
                        <p>File uploaded successfully! URL: {fileUrl}</p>
                        {/* ここでfileUrlを使用して、例えばグラフの描画などの処理を行うことができます。 */}
                    </div>
                )}
                <FUVFileKK />
            </div>


            <div id='SecondDerivative'>
                <FUVSecondDerivative />
            </div>

        </div>
    );
}

export default FUVGraph;
