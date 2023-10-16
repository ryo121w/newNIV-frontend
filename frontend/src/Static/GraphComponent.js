import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './css/GraphComponent.module.css';
import './css/Button.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function GraphComponent() {
    const [graphUrl, setGraphUrl] = useState(null);
    const [showGraph, setShowGraph] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showSecondCalculator, setShowSecondCalculator] = useState(false);

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

        try {
            const response = await axios.get(`${BACKEND_URL}api/latest_graph/`);
            if (response.data) {
                setGraphUrl(response.data);
                setShowGraph(true);
            }
        } catch (error) {
            console.error("Error generating the graph:", error);
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
