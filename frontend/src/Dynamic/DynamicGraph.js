import React, { useState, useEffect } from 'react';
import DynamicPlotlyChart from './Chart/DynamicPlotlyChart';
import AdvancedSpectrumChart from './Chart/AdvancedSpectrumChart';
import styles from './css/DynamicGraph.module.css';
import DynamicMarkers from './Chart/DynamicMarkers';
import NavigationBar from '../NavigationBar';
function DynamicGraph() {
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
        <div>
            <div className={navbarClasses}>
                <ul>
                    <li><p><NavigationBar /></p></li>
                    <li><p onClick={() => scrollTo('GraphComponent')}>Plotly Chart</p></li>
                    <li><p onClick={() => scrollTo('ConcentrationGraph')}>Google Chart</p></li>
                    <li><p onClick={() => scrollTo('Concentration')}>Area Peaks</p></li>
                </ul>
            </div>



            <div id="GraphComponent" className={styles['content']}>  {/* idを追加 */}
                <DynamicPlotlyChart />
            </div>

            <div id="GraphComponent" className={styles['content']}>  {/* idを追加 */}
                <DynamicMarkers />
            </div>
        </div>
    );
}

export default DynamicGraph;
