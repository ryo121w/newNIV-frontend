import React, { useState } from 'react';
import axios from 'axios';
import styles from './css/MultipleCorrespondenceAnalysis.module.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function MultipleCorrespondenceAnalysis() {
    const [loading, setLoading] = useState(false);
    const [mcaResult, setMcaResult] = useState(null);
    const [error, setError] = useState(null);

    const performMCA = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${BACKEND_URL}mca/`, {
                // Add any payload if needed
            });
            setMcaResult(response.data); // Assume the API returns the desired result directly
        } catch (err) {
            setError("Error performing MCA: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles['Graph-container']}>
            <div className={styles['Graph-left-side']}>
                <h2 className={styles.title}>MCA(多重対応分析)</h2>
                <button className="unique_button" onClick={performMCA}>
                    <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" class="sparkle">
                        <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
                    </svg>
                    <span className="unique_text">Generate</span>
                </button>
            </div>
            <div className={styles['Graph-right-side']}>
                {error && <div className={styles['error-message']}>{error}</div>}
                {loading && <div id="wifi-loader">
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
                {mcaResult && (
                    <div className={styles.resultContainer}>
                        <p>MCA Result:</p>
                        {/* Display the graph image */}
                        {mcaResult.graph_url &&
                            <img
                                className={styles.graphImage}
                                src={mcaResult.graph_url}
                                alt="MCA"
                            />
                        }
                    </div>
                )}
            </div>
        </div>
    );
}

export default MultipleCorrespondenceAnalysis;
