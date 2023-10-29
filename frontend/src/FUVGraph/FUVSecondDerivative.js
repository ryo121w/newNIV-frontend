import React, { useState } from 'react';
import axios from 'axios';
import styles from './css/FUVSecondDerivative.module.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function FUVSecondDerivative() {
    const [points, setPoints] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageURL, setImageURL] = useState('');  // ← 追加


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);

            await axios.post(`${BACKEND_URL}api/fuv_second_derivative_upload/`, formData, {
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

    const handleDerivative = async () => {
        try {
            setLoading(true);
            const data = {
                points: points
            };

            const response = await axios.post(`${BACKEND_URL}api/fuv_second_derivative/`, data);
            setImageURL(response.data.graph_url);  // ← 二次微分後にイメージのURLを更新
            alert('二次微分が完了しました！');
        } catch (error) {
            console.error("二次微分中にエラーが発生しました:", error);
            alert('二次微分中にエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };


    const handleDownload = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BACKEND_URL}api/fuv_second_derivative_download/`, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'fuv_second_derivative_data.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("ダウンロード中にエラーが発生しました:", error);
            alert('ダウンロード中にエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className={styles['Derivative-container']}>
            <h5 className={styles['title']}>二次微分</h5>

            <div className={styles['input-section']}>
                <label className={styles['label']}>
                    ポイント数:
                    <input
                        type="number"
                        value={points}
                        onChange={e => setPoints(e.target.value)}
                        className={styles['input']}
                    />
                </label>

                <label className={styles['label']}>
                    ファイルアップロード:
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className={styles['file-input']}
                    />
                </label>

                <button onClick={handleUpload} disabled={loading || !file} className={styles['cssbuttons-io-button']}>
                    ファイルアップロード
                </button>
            </div>

            <div className={styles['buttons']}>
                <button onClick={handleDerivative} disabled={loading || !file} className={styles['cssbuttons-io-button']}>
                    二次微分
                </button>

                <button onClick={handleDownload} className={styles['cssbuttons-io-button']}>
                    Download
                </button>
            </div>

            {loading && <div className={styles['loading']}>処理中...</div>}

            {/* イメージがある場合、それを表示 */}
            {imageURL && (
                <div className={styles['image-container']}>
                    <img src={imageURL} alt="二次微分グラフ" className={styles['image']} />
                </div>
            )}
        </div>
    );
}

export default FUVSecondDerivative;
