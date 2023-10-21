import React, { useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import styles from './css/FindPeak.module.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function FindPeak() {
    const [xStart, setXStart] = useState('');
    const [xEnd, setXEnd] = useState('');
    const [peaks, setPeaks] = useState([]);
    const [file, setFile] = useState(null); // ファイルのステート
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);

            await axios.post(`${BACKEND_URL}api/find_peak_upload_file/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('ファイルがアップロードされました！');
        } catch (error) {
            console.error("アップロード中にエラーが発生しました:", error);
            alert('アップロード中にエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };
    const handleFindPeak = async () => {
        try {
            setLoading(true);
            const data = {
                x_start: parseFloat(xStart),
                x_end: parseFloat(xEnd)
            };

            const response = await axios.post(`${BACKEND_URL}api/find_peak/`, data);
            setPeaks(response.data.peaks);
        } catch (error) {
            console.error("ピーク検出中にエラーが発生しました:", error);
            alert('ピーク検出中にエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };


    const handleDownloadPeaksData = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}api/download_peaks_data/`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'peaks_data.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("ピークデータのダウンロード中にエラーが発生しました:", error);
            alert('ピークデータのダウンロード中にエラーが発生しました。');
        }
    };

    return (
        <div className={styles['Peak-container']}>
            <h5 className={styles['title']}>ピーク検出</h5>

            <label className={styles['label']}>
                ファイルアップロード:
                <input
                    type="file"
                    onChange={handleFileChange}
                    className={styles['file-input']}
                />
            </label>

            <button onClick={handleFileUpload} disabled={loading || !file} className={styles['cssbuttons-io-button']}>
                ファイルアップロード
            </button>


            <label className={styles['label']}>
                X開始:
                <input
                    type="number"
                    value={xStart}
                    onChange={e => setXStart(e.target.value)}
                    className={styles['input']}
                />
            </label>

            <label className={styles['label']}>
                X終了:
                <input
                    type="number"
                    value={xEnd}
                    onChange={e => setXEnd(e.target.value)}
                    className={styles['input']}
                />
            </label>

            <button onClick={handleFindPeak} disabled={loading} className={styles['cssbuttons-io-button']}>
                ピーク検出
            </button>

            <button onClick={handleDownloadPeaksData} disabled={loading} className={styles['cssbuttons-io-button']}>
                ピークデータダウンロード
            </button>

            {loading && <div className={styles['loading']}>処理中...</div>}

            {/* ピークがある場合、それを表示 */}
            {peaks && peaks.length > 0 && (
                <Plot
                    data={[
                        {
                            x: peaks.map(peak => peak.x),
                            y: peaks.map(peak => peak.y),
                            type: 'scatter',
                            mode: 'markers',
                            marker: { color: 'red' },
                        }
                    ]}
                    layout={{ title: '検出されたピーク' }}
                />
            )}
        </div>
    );
}

export default FindPeak;
