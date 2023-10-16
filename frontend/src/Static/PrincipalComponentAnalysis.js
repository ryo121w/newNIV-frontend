import React, { useState } from 'react';
import axios from 'axios';
import styles from './css/PrincipalComponentAnalysis.module.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function PrincipalComponentAnalysis() {
    const [loading, setLoading] = useState(false);
    const [pcaResult, setPcaResult] = useState(null);
    const [error, setError] = useState(null);

    const performPCA = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${BACKEND_URL}pca/`, {
                // Add any payload if needed
            });
            setPcaResult(response.data); // Assume the API returns the desired result directly
        } catch (err) {
            setError("Error performing PCA: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles['Graph-container']}>
            <div className={styles['Graph-left-side']}>
                <h2 className={styles.title}>PCA(主成分分析)</h2>
                <button className="unique_button" onClick={performPCA}>
                    <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" class="sparkle">
                        <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
                    </svg>
                    <span className="unique_text">Generate</span>
                </button>
            </div>
            <div className={styles['Graph-right-side']}>
                {error && <p className={styles.error}>{error}</p>}
                {pcaResult && (
                    <div className={styles.resultContainer}>
                        {/* Display the graph image */}
                        {pcaResult && pcaResult.graph_url &&
                            <img
                                className={styles['NIRGraph']}
                                src={pcaResult.graph_url}
                                alt="PCA"
                            />
                        }

                    </div>
                )}
            </div>
        </div >
    );
}

export default PrincipalComponentAnalysis;





