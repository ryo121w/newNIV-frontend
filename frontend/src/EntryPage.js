// EntryPage.js
import React, { useState } from 'react';
import './EntryPage.css'; // CSSをインポート
import './ButtonStyles.css';
import './Welcome.css';
import StaticGraph from './StaticGraph';
import DynamicGraph from './Dynamic/DynamicGraph';

function EntryPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // ログイン状態を管理
    const [choice, setChoice] = useState(null);





    if (choice === "static") {
        return <StaticGraph />;
    } else if (choice === "dynamic") {
        return <DynamicGraph />;
    }

    return (
        <div className="container">
            <div className="left-container">
                <div className="Entry-Logo">
                    <img className="logo" src="/Free_Sample_By_Wix (1) (1).png" alt="NIV Logo" />
                    <p className="Entry-Near-Infrared-Visualizer">Near Infrared Visualizer</p>
                </div>
                <div className="popout">
                    <span style={{ '--i': 1 }}>W</span>
                    <span style={{ '--i': 2 }}>e</span>
                    <span style={{ '--i': 3 }}>l</span>
                    <span style={{ '--i': 4 }}>c</span>
                    <span style={{ '--i': 5 }}>o</span>
                    <span style={{ '--i': 6 }}>m</span>
                    <span style={{ '--i': 7 }}>e</span>
                    <span style={{ '--i': 8 }}>&nbsp;</span> {/* 空白 */}
                    <span style={{ '--i': 9 }}>t</span>
                    <span style={{ '--i': 10 }}>o</span>
                    <span style={{ '--i': 11 }}>&nbsp;</span> {/* 空白 */}
                    <span style={{ '--i': 12 }}>N</span>
                    <span style={{ '--i': 13 }}>I</span>
                    <span style={{ '--i': 14 }}>V</span>
                </div>
                <ul>
                    <li>
                        <h5>
                            <span className="emphasized-text">静的グラフ(Django)</span><br></br> このオプションを選ぶと、事前に計算されたデータを用いてグラフを生成します。ユーザーは新たなデータを入力することなく、静的なグラフを閲覧できます。
                        </h5>
                    </li>
                    <li>
                        <h5>
                            <span className="emphasized-text">動的グラフ (D3.js)</span><br></br>  このオプションを選ぶと、D3.jsを用いてリアルタイムでグラフが生成されます。ユーザーはデータを動的に変更でき、その結果を即座にグラフで確認することができます。
                        </h5>
                    </li>
                </ul>
            </div>
            <div className="right-container">
                <div className="button-container">
                    <button className="btn" onClick={() => setChoice('static')}>静的グラフ(Django)</button>
                    <p className="Entry-Note">※こちらは静的なグラフが出力されます。データによっては、適切な範囲でない可能性があります</p>
                    <button className="btn" onClick={() => setChoice('dynamic')}>動的グラフ (D3.js)</button>
                    <p className="Entry-Note">※こちらは動的なグラフです。具体的にスペクトルを操作してデータを評価したい時に使用してください。
                    </p>
                </div>
            </div>
            <p className="version">version 1.0.0</p>
        </div>
    );

}

export default EntryPage;
