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
                <h4 className={styles['NIR-title']}>NIRスペクトル</h4>
                <button className='unique-button' onClick={fetchGraph}>
                    <span className='span-mother'>
                        <span>G</span><span>e</span><span>n</span><span>e</span><span>r</span>
                        <span>a</span><span>t</span><span>e</span>
                    </span>
                    <span className="span-mother2">
                        <span>G</span><span>e</span><span>n</span><span>e</span><span>r</span>
                        <span>a</span><span>t</span><span>e</span>
                    </span>
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
