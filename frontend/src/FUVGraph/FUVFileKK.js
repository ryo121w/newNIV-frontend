import React, { useState } from 'react';
import axios from 'axios';
import styles from './css/FUVFileKK.module.css';
import FileUploader from './FUVFileUploader';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function KKTransformComponent() {
    const [nInf, setNInf] = useState('');
    const [incidentAngle, setIncidentAngle] = useState('');
    const [loading, setLoading] = useState(false);




    const handleKKTransform = async () => {
        try {
            setLoading(true);
            const postData = {
                n_inf: nInf,
                incident_angle: incidentAngle,
            };
            const response = await axios.post(`${BACKEND_URL}/api/kk_transformed_spectrum/`, postData);
            console.log(response.data);
            alert('KK変換が完了しました！');
        } catch (error) {
            console.error("KK変換中にエラーが発生しました:", error);
            alert('KK変換中にエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BACKEND_URL}api/kk_download_url`, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/zip' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'downloaded_files.zip');
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
        <div className={styles['container']}>
            <div className={styles['content']}>
                <div className={styles['left-section']}>
                    <FileUploader />
                </div>
                <div className={styles['right-section']}>
                    <label className={styles['label']}>
                        サンプルの屈折率 (n_inf):
                        <input
                            type="number"
                            value={nInf}
                            onChange={e => setNInf(e.target.value)}
                            className={styles['input']}
                        />
                    </label>

                    <label className={styles['label']}>
                        入射角 (incident_angle):
                        <input
                            type="number"
                            value={incidentAngle}
                            onChange={e => setIncidentAngle(e.target.value)}
                            className={styles['input']}
                        />
                    </label>
                </div>
            </div>
            <div className={styles['buttons']}>
                <button onClick={handleKKTransform} disabled={loading} className={styles['cssbuttons-io-button']}>
                    KK変換を開始
                </button>

                <button onClick={handleDownload} disabled={loading} className={styles['cssbuttons-io-button']}>
                    データをダウンロード
                </button>
            </div>
            {loading && <div className={styles['loading']}>変換中...</div>}
        </div>

    );
}

export default KKTransformComponent;
