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
            const response = await axios.post(`${BACKEND_URL}api/pca_analysis/`, {
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
        <div className={styles.container}>
            <h2 className={styles.title}>Principal Component Analysis</h2>
            <button className={styles.button} onClick={performPCA} disabled={loading}>
                {loading ? "Loading..." : "Perform PCA"}
            </button>
            {error && <p className={styles.error}>{error}</p>}
            {pcaResult && (
                <div className={styles.resultContainer}>
                    <p>PCA Result:</p>
                    {/* Display the graph image */}
                    {pcaResult && pcaResult.graph_url &&
                        <img
                            className={styles.graphImage}
                            src={pcaResult.graph_url}
                            alt="PCA"
                        />
                    }

                </div>
            )}
        </div>
    );
}

export default PrincipalComponentAnalysis;





