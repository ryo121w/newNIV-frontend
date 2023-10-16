import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './css/DifferenceGraphComponent.module.css';
import style from './css/Bento.module.css'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function DifferenceGraphComponent() {
    const [graphUrl, setGraphUrl] = useState(null);
    const [savedFilePath, setSavedFilePath] = useState(null);
    const [fileSaved, setFileSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCalculator, setShowCalculator] = useState(false); // New state
    const [showSecondCalculator, setShowSecondCalculator] = useState(false); // New state
    const [showGraph, setShowGraph] = useState(false); // 追加

    useEffect(() => {
        const fetchSavedFilePath = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}api/get_saved_file_path/`);
                console.log("Debug: Response from get_saved_file_path", response);
                if (response.data && response.data.file_path) {
                    setSavedFilePath(response.data.file_path);
                }
            } catch (error) {
                console.error("Error fetching saved file path:", error);
            }
        };

        if (fileSaved) {
            fetchSavedFilePath();
            setFileSaved(false);
        }
    }, [fileSaved]);

    const handleFileSaved = () => {
        setFileSaved(true);
    };

    const onSubmit = async (e) => {
        e.preventDefault();  // 追加
        setLoading(true);
        setError(null);
        try {
            const postData = { file_path: savedFilePath };  // savedFilePath を POST データとして送信
            const response = await axios.post(`${BACKEND_URL}api/difference_graph/`, postData);
            console.log("Debug: Response from difference_graph", response);
            if (response.data && response.data.graph_url) {
                setGraphUrl(response.data.graph_url);
            }
            setShowGraph(true);
            setShowCalculator(true);
            setShowSecondCalculator(true);
        } catch (error) {
            console.error("Error generating the graph:", error.response ? error.response.data.error : error.message);
            setError("Error generating the graph");
        } finally {
            setLoading(false);
        }
    };

    const onDownload = async (event) => {
        event.preventDefault();

        try {
            // Fetch the file from the backend
            const response = await fetch(`${BACKEND_URL}api/difference_download/`);

            if (!response.ok) {
                throw new Error(`Failed to fetch with status: ${response.status}`);
            }

            // Create a blob from the response and generate a URL for it
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Create an anchor element to start the download
            const a = document.createElement("a");
            a.href = url;
            a.download = "difference_data.xlsx";  // Name of the file to be downloaded
            a.click();

            // Clean up the URL after using it
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to download the file:", error);
        }
    };


    return (
        <div className={styles['Graph-container']}>
            <div className={styles['Graph-left-side']}>
                <h5 className={styles['title']}>差スペクトル</h5>
                <button onClick={onDownload} className={styles['cssbuttons-io-button']}>
                    <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M1 14.5a6.496 6.496 0 0 1 3.064-5.519 8.001 8.001 0 0 1 15.872 0 6.5 6.5 0 0 1-2.936 12L7 21c-3.356-.274-6-3.078-6-6.5zm15.848 4.487a4.5 4.5 0 0 0 2.03-8.309l-.807-.503-.12-.942a6.001 6.001 0 0 0-11.903 0l-.12.942-.805.503a4.5 4.5 0 0 0 2.029 8.309l.173.013h9.35l.173-.013zM13 12h3l-4 5-4-5h3V8h2v4z" fill="currentColor"></path></svg>
                    <span>Download</span>
                </button>
                <button className="unique_button" onClick={onSubmit}>
                    <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" class="sparkle">
                        <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
                    </svg>
                    <span className="unique_text">Generate</span>
                </button>
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
}



export default DifferenceGraphComponent;