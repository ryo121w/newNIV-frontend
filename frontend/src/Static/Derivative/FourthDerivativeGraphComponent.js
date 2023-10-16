import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/SecondDerivativeGraphComponent.module.css';
import style from '../css/Bento.module.css'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const FourthDerivativeGraphComponent = () => {
    const [graphUrl, setGraphUrl] = useState(null);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showSecondCalculator, setShowSecondCalculator] = useState(false);
    const [showGraph, setShowGraph] = useState(false);
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BACKEND_URL}api/fourth_derivative_graph/`);
            if (response.data && response.data.graph_url) {
                setGraphUrl(response.data.graph_url);
                setShowGraph(true);
                setShowCalculator(true);
                setShowSecondCalculator(true);
            }
        } catch (error) {
            console.error("Error fetching the latest graph:", error);
        }
    };

    const onDownload = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${BACKEND_URL}api/fourth_derivative_download/`);

            if (!response.ok) {
                // レスポンスのステータスコードが200以外の場合の処理
                throw new Error(`Failed to fetch with status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "excel_file_name_here.xlsx";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            // エラーハンドリングを行う
            console.error("Failed to download the file:", error);
        }

    };

    return (
        <div className={styles['Graph-container']}>
            <div className={styles['Graph-left-side']}>
                <h5 className="Second-Title">四次微分</h5>
                <button className="unique_button" onClick={onSubmit}>
                    <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" class="sparkle">
                        <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
                    </svg>
                    <span className="unique_text">Generate</span>
                </button>

                <a href="#" onClick={onDownload}>
                    <img className="floppy_save_icon" src="/0LcLFKJ29rp8yCa1693870439_1693870449.png" alt="Save as Excel File" />
                </a>
            </div>

            <div className={styles['Graph-right-side']}>
                <div className={`${styles['Bento_NIRGraph']} ${showGraph ? styles['show-element'] : ''}`}>
                    {graphUrl && <img className={styles['NIRGraph']} src={graphUrl} alt="Corrected NIR Spectrum" />}
                </div>
                <div className={styles['Calculator-container']}>
                    <div className={`${styles['Bento_NIRGraph_Calculator']} ${showCalculator ? styles['show-calculator'] : ''}`}>
                        {/* Calculator content */}
                    </div>
                    <div className={`${styles['Bento_NIRGraph_Second_Calculator']} ${showSecondCalculator ? styles['show-second_calculator'] : ''}`}>
                        {/* Second calculator content */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FourthDerivativeGraphComponent;