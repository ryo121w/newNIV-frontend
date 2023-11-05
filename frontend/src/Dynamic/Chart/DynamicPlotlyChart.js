import React, { useState, useRef, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import Plotly from 'plotly.js';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';  // スタイルもインポートする必要があります。

import createPlotlyComponent from 'react-plotly.js/factory';
import * as XLSX from 'xlsx';
import styles from '../css/DynamicChart.module.css';
import dynamicButtonStyles from '../css/DynamicButton.module.css';

// =============================================================================================

const Plot = createPlotlyComponent(Plotly);

// =============================================================================================


// =============================================================================================
const findPeaksAndValleys = (dataset) => {
    const peaks = [];
    const yData = dataset.y;
    for (let i = 1; i < yData.length - 1; i++) {
        if ((yData[i] > yData[i - 1] && yData[i] > yData[i + 1]) ||
            (yData[i] < yData[i - 1] && yData[i] < yData[i + 1])) {
            peaks.push({ x: dataset.x[i], y: yData[i] });
        }
    }
    return peaks;
};
// =============================================================================================


// =============================================================================================
const calculateMean = (values) => {
    return values.reduce((a, b) => a + b) / values.length;
};
// =============================================================================================


// =============================================================================================

const calculateVariance = (values) => {
    const mean = calculateMean(values);
    return values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
};
// =============================================================================================



// =============================================================================================
const DynamicPlotlyChart = () => {

    const [data, setData] = useState([]);
    const [showPeaks, setShowPeaks] = useState(false);
    const [animationState, setAnimationState] = useState('initial');
    const inputRef = useRef(null);
    const [isXAxisReversed, setXAxisReversed] = useState(false);
    const [revision, setRevision] = useState(0);
    const [xAxisTickFormat, setXAxisTickFormat] = useState('.0f');
    const [yAxisTickFormat, setYAxisTickFormat] = useState('.5f');
    const [concentrations, setConcentrations] = useState([]);
    const [originalJson, setOriginalJson] = useState([]);
    const [spectrumColors, setSpectrumColors] = useState({});
    const [xAxisLabel, setXAxisLabel] = useState('Wavelength(cm-1)');
    const [yAxisLabel, setYAxisLabel] = useState('Absorbance');
    const [sliderValue, setSliderValue] = useState(parseInt(yAxisTickFormat.slice(2, 3), 10));
    const [xSliderValue, setXSliderValue] = useState(parseInt(xAxisTickFormat.slice(2, 3), 10));
    const [concentration_headers, setConcentrationHeaders] = useState([]);
    const [showPicker, setShowPicker] = useState(null);  // 表示するカラーピッカーを制御
    const colorPickerRef = useRef(null);


    // =============================================================================================

    const handleColorChange = (header, color) => {
        setSpectrumColors(prev => ({ ...prev, [header]: color }));
    };
    // buttonがクリックされたときにinput要素をクリックする関数
    const triggerInputClick = () => {
        inputRef.current.click();

    };

    const handleReverseXAxis = () => {
        console.log("handleReverseXAxis is called"); // 追加
        setXAxisReversed(prevState => !prevState);
        setRevision(prevRevision => prevRevision + 1);
    };

    const plotRef = useRef(null);

    useEffect(() => {
        if (plotRef.current && Plotly) {
            try {
                console.log('Attempting to relayout:', isXAxisReversed ? 'reversed' : 'normal');
                Plotly.relayout(plotRef.current, {
                    'xaxis.autorange': isXAxisReversed ? 'reversed' : 'normal',
                });
            } catch (e) {
                console.error('Plotly relayout failed:', e);
            }
        }
    }, [isXAxisReversed, plotRef.current, Plotly]);


    useEffect(() => {
        console.log("isXAxisReversed is now: ", isXAxisReversed);  // 追加
    }, [isXAxisReversed]);

    // =============================================================================================



    // =============================================================================================
    const layout = {
        dragmode: 'zoom',
        width: 900,  // グラフの幅を設定
        height: 600,

        xaxis: {
            title: {
                text: xAxisLabel, // Update this line
                font: {
                    family: 'Arial Black, Arial, sans-serif',  // 太字のフォントを指定
                    size: 18  // サイズを調整
                }
            },
            showgrid: false,
            zeroline: false,
            showline: true,
            autorange: isXAxisReversed ? 'reversed' : 'normal',
            linecolor: 'rgba(153, 153, 153, 0.8)',
            linewidth: 1,
            tickformat: xAxisTickFormat,


        },
        yaxis: {
            title: {
                text: yAxisLabel, // And this line
                font: {
                    family: 'Arial Black, Arial, sans-serif',  // 太字のフォントを指定
                    size: 18 // サイズを調整
                }

            },
            showgrid: false,
            zeroline: false,
            linecolor: 'rgba(153, 153, 153, 0.8)',
            tickformat: yAxisTickFormat,
        },
        showlegend: true,
        hovermode: 'closest', // Add this line for custom tooltip mode
        hoverlabel: {
            bgcolor: "#50514F",  // 背景色
            font: {
                family: "Arial",
                size: 16,
                color: "#F4F4F4"  // 文字色
            },
            bordercolor: "#F25F5C",  // ボーダーカラー
            borderwidth: 2  // ボーダー幅
        },  // Add this for custom tooltip label
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        // Add this section for animation
        animation: {
            duration: 1000,
            easing: 'cubic-in-out'
        }
    };
    // =============================================================================================



    // =============================================================================================
    useEffect(() => {
        const plotElement = plotRef.current;
        if (plotElement && typeof plotElement.on === 'function') {
            // ダブルクリックイベントのリスナーを追加
            plotElement.on('plotly_doubleclick', () => {
                Plotly.relayout(plotElement, {
                    'xaxis.autorange': true,
                    'yaxis.autorange': true
                });
            });

            // 右クリックイベントのリスナーを追加
            plotElement.addEventListener('contextmenu', (e) => {
                e.preventDefault(); // デフォルトの右クリックメニューを無効化
                Plotly.relayout(plotElement, {
                    'xaxis.autorange': true,
                    'yaxis.autorange': true
                });
            });

            // クリーンアップ
            return () => {
                if (plotElement) {
                    plotElement.removeAllListeners('plotly_doubleclick');
                    plotElement.removeEventListener('contextmenu');
                }
            };
        }
    }, [plotRef]);



    useEffect(() => {
        const plotElement = plotRef.current;
        if (plotElement && animationState === 'animate') {
            const handleAnimationEnd = () => {
                // アニメーションが終了した後に状態を変更する
                setAnimationState('done');
            };

            plotElement.addEventListener('animationend', handleAnimationEnd);

            return () => {
                plotElement.removeEventListener('animationend', handleAnimationEnd);
            };
        }
    }, [plotRef, animationState]);
    // =============================================================================================



    // =============================================================================================
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const workbook = XLSX.read(bstr, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Concentrations or legend headers are assumed to be in the first row
                const concentrations = json[0].slice(1);
                setConcentrationHeaders(concentrations);

                const dynamicColor = (index) => `hsl(${240 + (index * 20) % 120}, 100%, 50%)`;

                // Update spectrumColors state for the default colors
                const initialColors = {};
                concentrations.forEach((concentration, index) => {
                    initialColors[concentration] = dynamicColor(index);
                });
                setSpectrumColors(initialColors);

                setOriginalJson(json);
            };
            reader.readAsBinaryString(file);
        }
    };

    useEffect(() => {
        if (originalJson.length > 0) {
            setData(computeDataset(originalJson));
        }
    }, [originalJson, spectrumColors]);


    // =============================================================================================


    // =============================================================================================
    useEffect(() => {
        if (data.length > 0) {
            const firstDataset = data[0];
            if (firstDataset && firstDataset.x) {
                const json = firstDataset.x.map((xValue, index) => {
                    const row = { [xValue]: xValue };
                    concentrations.forEach((concentration, cIndex) => {
                        row[concentration] = data[cIndex].y[index];
                    });
                    return row;
                });
                setData(computeDataset(json));
            }
        }
    }, [spectrumColors]);


    useEffect(() => {
        setData(computeDataset(originalJson));
    }, [spectrumColors, originalJson]);
    // =============================================================================================


    // =============================================================================================
    const computeDataset = (json) => {
        const labels = json.map((row) => row[0]);
        return concentration_headers.map((header, index) => {
            return {
                x: labels,
                y: json.map((row) => row[index + 1]),
                type: 'scatter',
                mode: 'lines',
                name: header,
                line: {
                    shape: 'spline',
                    color: spectrumColors[header] || 'blue',  // spectrumColorsを使用して色を設定
                    width: 1
                }
            };
        });
    };

    // =============================================================================================

    // =============================================================================================
    const handleFindPeaks = () => {
        if (showPeaks) {
            setData(data.filter((trace) => trace.name !== 'Peaks'));
        } else {
            const newDataset = [...data];
            data.forEach((dataset, index) => {
                const peaks = findPeaksAndValleys(dataset);
                const peakTrace = {
                    x: peaks.map((peak) => peak.x),
                    y: peaks.map((peak) => peak.y),
                    mode: 'markers',
                    type: 'scatter',
                    name: 'Peaks',
                    marker: { size: 4, color: 'red' }
                };
                newDataset.push(peakTrace);
            });
            setData(newDataset);

            // x 軸の範囲を調整
            const maxX = Math.max(...newDataset.flatMap(dataset => dataset.x));
            Plotly.relayout(plotRef.current, { 'xaxis.range': [4000, maxX] });

            // y 軸の範囲を調整
            const allYValues = newDataset.flatMap(dataset => dataset.y);
            const minY = Math.min(...allYValues);
            const maxY = Math.max(...allYValues);

            Plotly.relayout(plotRef.current, { 'yaxis.range': [minY, maxY] });
        }
        setShowPeaks(!showPeaks);
        if (plotRef.current) {
            Plotly.relayout(plotRef.current, { 'dragmode': 'zoom' });
        }
    };
    // =============================================================================================

    // =============================================================================================
    const handlePlotRelayout = (eventData, graphDiv) => {
        if (graphDiv && graphDiv._fullLayout && (eventData['xaxis.range[0]'] || eventData['yaxis.range[0]'])) {
            Plotly.relayout(graphDiv, { 'yaxis.showline': true });
        }
    };
    // =============================================================================================

    // =============================================================================================
    const handlePlotlySelected = (eventData) => {
        console.log("Complete event data:", JSON.stringify(eventData));
        if (!eventData) return;

        const selectedData = eventData.points;
        const statsByConcentration = {};
        let totalY = []; // To store y-values across all concentrations

        selectedData.forEach((point) => {
            console.log("Point details:", point);
            const { curveNumber, x, y } = point;
            const concentration = data[curveNumber].name; // Dynamically fetch concentration from dataset

            if (!statsByConcentration[concentration]) {
                statsByConcentration[concentration] = { x: [], y: [] };
            }

            statsByConcentration[concentration].x.push(x);
            statsByConcentration[concentration].y.push(y);

            totalY.push(y);  // Add the y-value to the total array
        });

        // Log statistics for each concentration
        for (const [concentration, values] of Object.entries(statsByConcentration)) {
            const mean = calculateMean(values.y);
            const variance = calculateVariance(values.y);
            console.log(`${concentration}`);
            console.log(`y軸平均: ${mean}`);
            console.log(`分散: ${variance}`);
        }

        // Log overall statistics
        const totalMean = calculateMean(totalY);
        const totalVariance = calculateVariance(totalY);
        console.log("全体の統計:");
        console.log(`y軸平均: ${totalMean}`);
        console.log(`分散: ${totalVariance}`);
    };
    // =============================================================================================


    const plotlyConfig = {
        // 他の設定（必要に応じて）
        toImageButtonOptions: {
            format: 'png', // 画像の形式（png, jpeg, webpなど）
            width: 1600,   // 画像の幅
            height: 1200,  // 画像の高さ
            scale: 3      // 画像のスケール（解像度を向上させるための倍率）
        }
    };


    useEffect(() => {
        function handleClickOutside(event) {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
                setShowPicker(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    return (
        <div className={styles['content-wrapper']}>
            <div className={`${styles['button-title-container']} ${animationState === 'animate' ? styles['container-slide-up'] : ''}`}>
                <h2 className={styles['Plotly-Title']}>Plotly Chart</h2>
                <input
                    type="file"
                    accept=".csv, .xlsx, .xlsm"
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
                <button onClick={handleFindPeaks} className={dynamicButtonStyles.button}>Find Peaks</button>
                <button onClick={handleReverseXAxis} className={dynamicButtonStyles.button}>
                    {isXAxisReversed ? "Normal X Axis" : "Reverse X Axis"}
                </button>
            </div>


            <div ref={plotRef} className={animationState === 'animate' ? styles['graph-fade-in'] : ''}>
                {data.length > 0 && (
                    <Plot
                        className={styles[Plot]}
                        data={data}
                        layout={{ ...layout, xaxis: { ...layout.xaxis, autorange: isXAxisReversed ? 'reversed' : 'normal' } }}
                        onRelayout={(eventData, graphDiv) => handlePlotRelayout(eventData, graphDiv)}
                        onSelected={(eventData) => handlePlotlySelected(eventData)}
                        revision={revision}
                        config={plotlyConfig}
                    />
                )}


                <div className={styles['settings-container']}>
                    <div className={styles['settings-controls']}>
                        <div className={styles['slider-container']}>
                            <label className={styles['slider-label']}>x-axis</label>
                            <Slider
                                min={0}
                                max={10}
                                value={xSliderValue}
                                onChange={value => {
                                    setXSliderValue(value);
                                    setXAxisTickFormat(`.${value}f`);
                                }}
                                trackStyle={{
                                    backgroundColor: '#fff',
                                    height: 14
                                }}
                                handleStyle={{
                                    borderColor: '#CBCDCD',
                                    borderWidth: 0.5,
                                    height: 14,
                                    width: 14, // 横の大きさを少し大きくして楕円の形に
                                    marginLeft: 0, // ハンドルの半分の幅

                                    marginTop: 0, // トラックの半分の高さからハンドルの半分の高さを引く
                                    backgroundColor: '#fff',
                                    boxShadow: 'none',
                                    borderRadius: '10px' // 上下は7px、左右は10pxの楕円に
                                }}
                                railStyle={{
                                    backgroundColor: '#ddd',
                                    height: 14
                                }}
                            />
                        </div>
                        <div className={styles['slider-container']}>
                            <label className={styles['slider-label']}>y-axis</label>
                            <Slider
                                min={0}
                                max={10}
                                value={sliderValue}
                                onChange={value => {
                                    setSliderValue(value);
                                    setYAxisTickFormat(`.${value}f`);
                                }}
                                trackStyle={{
                                    backgroundColor: '#fff',
                                    height: 14
                                }}
                                handleStyle={{
                                    borderColor: '#CBCDCD',
                                    borderWidth: 0.5,
                                    height: 14,
                                    width: 14, // 横の大きさを少し大きくして楕円の形に
                                    marginLeft: 0, // ハンドルの半分の幅

                                    marginTop: 0, // トラックの半分の高さからハンドルの半分の高さを引く
                                    backgroundColor: '#fff',
                                    boxShadow: 'none',
                                    borderRadius: '10px' // 上下は7px、左右は10pxの楕円に
                                }}
                                railStyle={{
                                    backgroundColor: '#ddd',
                                    height: 14
                                }}
                            />
                        </div>
                        <div className={styles['label-input']}>
                            <label>X Label</label>
                            <input
                                type="text"
                                value={xAxisLabel}
                                onChange={e => setXAxisLabel(e.target.value)}
                                className={styles['styled-input']}
                            />
                        </div>
                        <div className={styles['label-input']}>
                            <label>Y Label</label>
                            <input
                                type="text"
                                value={yAxisLabel}
                                onChange={e => setYAxisLabel(e.target.value)}
                                className={styles['styled-input']}
                            />
                        </div>
                    </div>

                    <div className={styles['color-pickers']}>
                        {concentration_headers.map(header => (
                            <div key={header} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                {/* Color Preview */}
                                <div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        backgroundColor: spectrumColors[header] || '#0000FF',
                                        marginRight: '10px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setShowPicker(prevHeader => (prevHeader === header ? null : header))}
                                ></div>

                                {showPicker === header && (
                                    <div
                                        ref={colorPickerRef}
                                        tabIndex={0}
                                        style={{
                                            outline: "none",
                                            zIndex: 1000,
                                            position: 'fixed', // これを追加
                                            top: '10px',       // これを追加
                                            right: '10px'     // これを追加
                                        }}
                                    >
                                        <SketchPicker
                                            color={spectrumColors[header] || '#0000FF'}
                                            onChangeComplete={color => {
                                                handleColorChange(header, color.hex);
                                            }}
                                        />
                                    </div>
                                )}


                                {/* Label */}
                                <label>{header} Color</label>
                            </div>
                        ))}
                    </div>
                </div>



            </div>
        </div>
    );
};

export default DynamicPlotlyChart;