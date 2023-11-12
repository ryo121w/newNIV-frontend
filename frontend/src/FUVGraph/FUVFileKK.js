import React, { useState } from 'react';
import axios from 'axios';
import styles from './css/FUVFileKK.module.css';
import FileUploader from './FUVFileUploader';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function KKTransformComponent() {
    const [nInf, setNInf] = useState('');
    const [incidentAngle, setIncidentAngle] = useState('');
    const [concentrationCounts, setConcentrationCounts] = useState([]);
    const [loading, setLoading] = useState(false);




    const handleKKTransform = async () => {
        try {
            setLoading(true);
            // 各濃度に対応する屈折率と入射角を含むオブジェクトを作成
            const postData = {
                n_inf: nInf,
                incident_angle: incidentAngle,
            };
            const response = await axios.post(`${BACKEND_URL}api/kk_transformed_spectrum/`, postData);
            console.log(response.data);
            alert('KK変換が完了しました！');
        } catch (error) {
            console.error("KK変換中にエラーが発生しました:", error);
            alert('KK変換中にエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };

    const getConcentrationCount = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BACKEND_URL}api/get_fuv_concentration_count`);
            console.log('API Response:', response.data);  // デバッグ出力
            const counts = Array.isArray(response.data.concentration_labels)
                ? response.data.concentration_labels
                : [];
            setConcentrationCounts(counts);
            setNInf(new Array(counts.length).fill(''));  // nInf ステートを更新
            console.log('Updated concentrationCounts:', counts);  // デバッグ出力
            console.log('Updated nInf:', nInf);  // デバッグ出力
        } catch (error) {
            console.error("濃度数の取得中にエラーが発生しました:", error);
            alert('濃度数の取得中にエラーが発生しました。');
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
                    <button onClick={getConcentrationCount} disabled={loading} className={styles['cssbuttons-io-button']}>
                        濃度数を取得
                    </button>

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
