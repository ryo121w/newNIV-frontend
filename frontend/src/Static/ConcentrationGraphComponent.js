import React, { useState } from 'react';
import axios from 'axios';
import styles from './css/ConcentrationGraphComponent.module.css';
import './css/Button.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function ConcentrationGraphComponent({ graphConcentrations: initialGraphConcentrations }) {
    const [graphUrl, setGraphUrl] = useState(null);
    const [concentrations, setConcentrations] = useState({});
    const [showCalculator, setShowCalculator] = useState(false);
    const [showSecondCalculator, setShowSecondCalculator] = useState(false);
    const [showGraph, setShowGraph] = useState(false);
    const [graphConcentrations, setGraphConcentrations] = useState(initialGraphConcentrations);
    const [isModalOpen, setIsModalOpen] = useState(false);


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
        <>
            <div className={styles['Graph-container']}>
                <div className={styles['Graph-left-side']}>
                    <h5 className={styles['title']}>モル吸光係数</h5>


                    <button onClick={() => setIsModalOpen(true)} className={styles['open_button']}>
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> Open
                    </button>



                    <button onClick={handleButtonClick} className={styles['cssbuttons-io-button']}>
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
            {isModalOpen && (
                <>
                    <div
                        className={styles['ModalBackground']}
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    <div className={styles['Modal']}>
                        <span
                            onClick={() => setIsModalOpen(false)}
                            className={styles.CloseIcon} // 閉じるアイコンのスタイルを適用
                        >
                            ×
                        </span>
                        {concentrationInputs}
                        <button onClick={fetchConcentrationsFromS3} className={styles['S3']}>
                            <div class="svg-wrapper-1">
                                <div class="svg-wrapper">
                                    <svg class="icon" height="30" width="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z">
                                    </path>
                                    </svg>
                                </div>
                            </div>
                            <span>From S3</span>
                        </button>
                    </div>
                </>
            )}
        </>
    );
}

ConcentrationGraphComponent.defaultProps = {
    graphConcentrations: []
};

export default ConcentrationGraphComponent;
