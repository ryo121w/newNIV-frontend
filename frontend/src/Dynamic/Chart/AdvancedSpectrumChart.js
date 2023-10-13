import React, { useState, useRef } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import dynamicButtonStyles from '../css/DynamicButton.module.css';
import styles from '../css/AreaPeak.module.css'

const BASE_API_URL = process.env.REACT_APP_API_ENDPOINT;

// 動的に色を生成する関数
function generateColors(n) {
    let colors = [];
    for (let i = 0; i < n; i++) {
        const hue = Math.floor(360 * i / n);
        colors.push(`hsl(${hue}, 100%, 50%)`);
    }
    return colors;
}

const formatDataForPlotly = (results) => {
    const plotData = [];

    // 濃度の数に基づいて色を動的に生成
    const numConcentrations = Object.keys(results).length;
    const colors = generateColors(numConcentrations);

    Object.keys(results).forEach((conc, colorIdx) => {
        const { intervals, areas, peak_positions } = results[conc];
        const color = colors[colorIdx % colors.length];  // 色を循環させる

        if (intervals && areas && peak_positions) {
            intervals.forEach(([start, end], idx) => {
                const trace = {
                    x: [`${start}-${end}`],  // x軸のラベル
                    y: [areas[idx]],  // y軸の値（面積）
                    text: [`Peak Position: ${peak_positions[idx]}<br>Area: ${areas[idx]}`],  // ツールチップに表示するテキスト
                    hoverinfo: 'text+x+y',
                    type: 'bar',
                    name: `${conc} M - Peak ${idx + 1}`,  // 各ピークにユニークな名前を付ける
                    marker: { color: color }  // 色を設定
                };
                plotData.push(trace);
            });
        }
    });

    return plotData;
};

const AdvancedSpectrumChart = () => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('data_file', file);

        try {
            const response = await axios.post(`${BASE_API_URL}api/advanced/`, formData);
            const results = response.data.results;

            const formattedData = formatDataForPlotly(results);
            setData(formattedData);
        } catch (error) {
            console.error("Error:", error);
            setError('データのアップロードまたは解析中にエラーが発生しました。');
        }
    };

    const triggerInputClick = () => {
        inputRef.current.click();
    };

    return (
        <div className={styles['content-wrapper']}>
            <h2 className={styles['Area-Title']}>Area Peaks</h2>
            <input
                type="file"
                accept=".csv,.xlsx,.xlsm"
                onChange={handleFileChange}
                ref={inputRef}
                style={{ display: 'none' }}
            />


            <button onClick={triggerInputClick} className={dynamicButtonStyles.button}>
                <span>Select File</span>
                <svg width="34" height="34" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="37" cy="37" r="35.5" stroke="black" stroke-width="3"></circle>
                    <path d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z" fill="black"></path>
                </svg>
            </button>
            <button onClick={handleSubmit} className={dynamicButtonStyles.button}>Submit</button>




            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Plot data={data} className={styles['Plot']} />
        </div>
    );
};

export default AdvancedSpectrumChart;
