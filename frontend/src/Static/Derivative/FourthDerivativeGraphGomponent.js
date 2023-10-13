import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/SecondDerivativeGraphComponent.css';
import styles from '../css/Bento.module.css'

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
        <div className="Main-Wrapper">
            <div className="Second-Title-Button-Container">
                <h5 className="Second-Title">四次微分</h5>
                <form onSubmit={onSubmit}>
                    <button className="unique-button" type="submit">Generate</button>
                </form>

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