import React, { useState } from 'react';
import axios from 'axios';
import styles from './css/ConcentrationGraphComponent.module.css';
import './css/ConcentrationGraphLoader.css';
import './css/Button.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function ConcentrationGraphComponent({ graphConcentrations: initialGraphConcentrations }) {
    const [graphUrl, setGraphUrl] = useState(null);
    const [concentrations, setConcentrations] = useState({});
    const [showCalculator, setShowCalculator] = useState(false);
    const [showSecondCalculator, setShowSecondCalculator] = useState(false);
    const [showGraph, setShowGraph] = useState(false);
    const [graphConcentrations, setGraphConcentrations] = useState(initialGraphConcentrations);


    const handleConcentrationChange = (e, molarity) => {
        const newConcentrations = {
            ...concentrations,
            [molarity]: e.target.value,
        };
        setConcentrations(newConcentrations);
    };

    const handleButtonClick = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${BACKEND_URL}api/download_excel/`);

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
    const fetchConcentrationsFromS3 = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}api/get_files_from_s3/`);
            if (response.data && response.data.molarities) {
                setGraphConcentrations(response.data.molarities);  // Stateを更新
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const onSubmit = async () => {
        const formData = new FormData();
        Object.keys(concentrations).forEach((key) => {
            formData.append('concentrations[]', concentrations[key]);
        });

        try {
            const graphResponse = await axios.post(`${BACKEND_URL}api/concentration_graph/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // `graph_url` を参照するように変更
            if (graphResponse.data && graphResponse.data.graph_url) {
                setGraphUrl(graphResponse.data.graph_url);
            }
            setShowGraph(true);
            setShowCalculator(true);
            setShowSecondCalculator(true);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };


    const concentrationInputs = (graphConcentrations && Array.isArray(graphConcentrations))
        ? graphConcentrations.map((molarity, index) => (
            <div key={molarity + "-" + index} className={styles['input-group-set']}>
                <label className={styles['Molar-Label']}><p>{molarity}<br></br> Water </p></label>
                <input
                    type="text"
                    value={concentrations[molarity] || ''}
                    onChange={e => handleConcentrationChange(e, molarity)}
                />
            </div>
        ))
        : [];

    return (
        <div className={styles['Molar-Component-Wrapper']}>
            <div className={styles['graph-concentration-container']}>
                <div className={styles['concentration-container']}>
                    <h5 className={styles['Molar-Title']}>モル吸光係数</h5>
                    {concentrationInputs}
                    <div className="Graph-left-side">
                        <button onClick={fetchConcentrationsFromS3}>Fetch Concentrations from S3</button>
                        <button onClick={handleButtonClick} className="btn btn-primary">
                            Download Excel
                        </button>
                        <button className="unique-button" onClick={onSubmit}>
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
                    </div>
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
        </div>
    );
}

ConcentrationGraphComponent.defaultProps = {
    graphConcentrations: []
};

export default ConcentrationGraphComponent;
