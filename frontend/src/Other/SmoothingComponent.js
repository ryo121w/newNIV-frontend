// SmoothingComponent.js
import React, { useState } from 'react';
import axios from 'axios';
import styles from './css/SmoothingComponent.module.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function SmoothingComponent() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [s3Path, setS3Path] = useState(null); // 追加: アップロードされたファイルのs3_pathを保存するステート
    const [windowSize, setWindowSize] = useState(5);  // ウィンドウサイズのステート
    const [polynomialOrder, setPolynomialOrder] = useState(3);  // 多項式の次数のステート


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${BACKEND_URL}api/upload_file_for_smoothing/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setS3Path(response.data.s3_path); // 追加: s3_pathをステートに保存
            alert('ファイルがアップロードされました！');
        } catch (error) {
            console.error("アップロード中にエラーが発生しました:", error);
            alert('アップロード中にエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };


    const handleSmoothing = async () => {
        try {
            setLoading(true);

            const response = await axios.post(`${BACKEND_URL}api/smoothing_data/`,
                {
                    s3_path: s3Path,
                    window_size: windowSize,
                    polynomial_order: polynomialOrder
                }
            );

            alert('スムージングが完了しました！');
        } catch (error) {
            console.error("スムージング中にエラーが発生しました:", error);
            alert('スムージング中にエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };



    const handleDownloadSmoothedData = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}api/download_smoothed_data/`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'smoothed_data.xlsx');  // ファイル名を'smoothed_data.xlsx'に設定
            document.body.appendChild(link);
            link.click();

        } catch (error) {
            console.error("スムージングデータのダウンロード中にエラーが発生しました:", error);
            alert('スムージングデータのダウンロード中にエラーが発生しました。');
        }
    };

    return (
        <div className={styles['Smoothing-container']}>
            <h5 className={styles['title']}>データのスムージング</h5>

            <label className={styles['label']}>
                ファイルアップロード:
                <input
                    type="file"
                    onChange={handleFileChange}
                    className={styles['file-input']}
                />
            </label>

            <label>
                ウィンドウサイズ:
                <input
                    type="number"
                    value={windowSize}
                    onChange={(e) => setWindowSize(e.target.value)}
                />
            </label>

            <label>
                多項式の次数:
                <input
                    type="number"
                    value={polynomialOrder}
                    onChange={(e) => setPolynomialOrder(e.target.value)}
                />
            </label>

            <button onClick={handleFileUpload} disabled={loading || !file} className={styles['cssbuttons-io-button']}>
                ファイルアップロード
            </button>

            <button onClick={handleSmoothing} disabled={loading} className={styles['cssbuttons-io-button']}>
                スムージング実行
            </button>

            <button onClick={handleDownloadSmoothedData} disabled={loading} className={styles['cssbuttons-io-button']}>
                スムージングデータダウンロード
            </button>

            {loading && <div className={styles['loading']}>処理中...</div>}
        </div>
    );
}

export default SmoothingComponent;