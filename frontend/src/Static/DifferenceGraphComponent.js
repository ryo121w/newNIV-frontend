import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/DifferenceGraphComponent.css';
import styles from './css/Bento.module.css'

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
        <div className="Main-Wrapper">
            <div className="Second-Title-Button-Container">
                <h5 className="Second-Title">差スペクトル</h5>
                <form onSubmit={onSubmit}>
                    <button className="unique-button" type="submit">
                        <span className="span-mother">
                            <span>G</span>
                            <span>e</span>
                            <span>n</span>
                            <span>e</span>
                            <span>r</span>
                            <span>a</span>
                            <span>t</span>
                            <span>e</span>
                        </span>
                        <span className="span-mother2">
                            <span>G</span>
                            <span>e</span>
                            <span>n</span>
                            <span>e</span>
                            <span>r</span>
                            <span>a</span>
                            <span>t</span>
                            <span>e</span>
                        </span>
                    </button>
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
}



export default DifferenceGraphComponent;