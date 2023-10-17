import React, { useState } from 'react';
import axios from 'axios';

function KKTransformComponent() {
    const [nInf, setNInf] = useState(''); // サンプルの屈折率 (n_inf) の状態
    const [incidentAngle, setIncidentAngle] = useState(''); // 入射角 (incident_angle) の状態
    const [np, setNp] = useState(''); // 内部反射部材の屈折率 (np) の状態
    const [loading, setLoading] = useState(false); // ロード中の状態

    const handleKKTransform = async () => {
        try {
            setLoading(true);
            const postData = {
                n_inf: nInf,
                incident_angle: incidentAngle,
                np: np
            };
            const response = await axios.post('/api/kk_transformed_spectrum/', postData);
            console.log(response.data);
            alert('KK変換が完了しました！');
        } catch (error) {
            console.error("KK変換中にエラーが発生しました:", error);
            alert('KK変換中にエラーが発生しました。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>KK変換</h3>
            <label>
                サンプルの屈折率 (n_inf):
                <input
                    type="number"
                    value={nInf}
                    onChange={e => setNInf(e.target.value)}
                />
            </label>
            <br />
            <label>
                入射角 (incident_angle):
                <input
                    type="number"
                    value={incidentAngle}
                    onChange={e => setIncidentAngle(e.target.value)}
                />
            </label>
            <br />
            <label>
                内部反射部材の屈折率 (np):
                <input
                    type="number"
                    value={np}
                    onChange={e => setNp(e.target.value)}
                />
            </label>
            <br />
            <button onClick={handleKKTransform} disabled={loading}>
                KK変換を開始
            </button>
            {loading && <p>変換中...</p>}
        </div>
    );
}

export default KKTransformComponent;
