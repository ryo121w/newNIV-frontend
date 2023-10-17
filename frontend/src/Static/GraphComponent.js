import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './css/GraphComponent.module.css';
import './css/Button.css';
import './css/Loader.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function GraphComponent() {
    const [graphUrl, setGraphUrl] = useState(null);
    const [showGraph, setShowGraph] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showSecondCalculator, setShowSecondCalculator] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // 追加：ローディング状態
    const [errorMessage, setErrorMessage] = useState(null); // 追加：エラーメッセージの状態

    useEffect(() => {
        if (showGraph) {
            setTimeout(() => {
                setShowCalculator(true);
            }, 600);

            setTimeout(() => {
                setShowSecondCalculator(true);
            }, 1000);
        }
    }, [showGraph]);


    const fetchGraph = async () => {
        console.log("fetchGraph called");
        setIsLoading(true); // 通信開始時にローディング状態を true に設定

        try {
            const response = await axios.get(`${BACKEND_URL}api/latest_graph/`);
            if (response.data) {
                setGraphUrl(response.data);
                setShowGraph(true);
            }
        } catch (error) {
            console.error("Error generating the graph:", error);
            setErrorMessage("Failed to generate the graph."); // エラーメッセージを設定
        } finally {
            setIsLoading(false); // 通信完了後にローディング状態を false に設定
        }
    };


    return (
        <div className={styles['Graph-container']}>

            <div className={styles['Graph-left-side']}>
                <h4 className={styles['title']}>NIRスペクトル</h4>
                <button className="unique_button" onClick={fetchGraph}>
                    <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" class="sparkle">
                        <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
                    </svg>
                    <span className="unique_text">Generate</span>
                </button>

            </div>
            <div className={styles['Graph-right-side']}>
                <div className={`${styles['Bento_NIRGraph']} ${showGraph ? styles['show-element'] : ''}`}>
                    {graphUrl && <img className={styles['NIRGraph']} src={graphUrl} alt="NIR Spectrum" />}
                </div>
                {errorMessage && <div className={styles['error-message']}>{errorMessage}</div>} {/* エラーメッセージの表示 */}
                {isLoading && <div id="wifi-loader">
                    <svg class="circle-outer" viewBox="0 0 86 86">
                        <circle class="back" cx="43" cy="43" r="40"></circle>
                        <circle class="front" cx="43" cy="43" r="40"></circle>
                        <circle class="new" cx="43" cy="43" r="40"></circle>
                    </svg>
                    <svg class="circle-middle" viewBox="0 0 60 60">
                        <circle class="back" cx="30" cy="30" r="27"></circle>
                        <circle class="front" cx="30" cy="30" r="27"></circle>
                    </svg>
                    <svg class="circle-inner" viewBox="0 0 34 34">
                        <circle class="back" cx="17" cy="17" r="14"></circle>
                        <circle class="front" cx="17" cy="17" r="14"></circle>
                    </svg>
                    <div class="text" data-text="Generating"></div>
                </div>} {/* ローディングインジケータの表示 */}

                <div className={styles['Calculator-container']}>
                    <div className={`${styles['Bento_NIRGraph_Calculator']} ${showCalculator ? styles['show-calculator'] : ''}`}>
                        {/* Calculator content */}
                    </div>
                    <div className={`${styles['Bento_NIRGraph_Second_Calculator']} ${showSecondCalculator ? styles['show-second_calculator'] : ''}`}>
                        {/* Second calculator content */}
                    </div>
                </div>
            </div>

        </div >
    );
}

export default GraphComponent;
