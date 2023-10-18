// EntryPage.js
import React, { useState, useEffect } from 'react';
import styles from './EntryPage.module.css'
import StaticGraph from './StaticGraph';
import DynamicGraph from './Dynamic/DynamicGraph';
import FUVGraph from './FUVGraph/FUVGraph';

function EntryPage() {
    const [choice, setChoice] = useState(null);
    const [randomFile, setRandomFile] = useState('');


    const files = [
        '/images/NIVLogo.png',
        '/images/NIV.gif',
        '/images/NIV2.gif',
        '/images/NIV3.gif',
        '/images/NIV4.gif',
        '/images/NIV5.gif',
    ];


    // コンポーネントがマウントされたときにランダムなファイルを選択
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * files.length);
        setRandomFile(files[randomIndex]);
    }, []);

    // ランダムに選択されたファイルを表示
    const renderRandomFile = () => {
        return <img className={styles['logo']} src={`${process.env.PUBLIC_URL}${randomFile}`} alt="NIV Logo" />;
    };





    if (choice === "static") {
        return <StaticGraph />;
    } else if (choice === "dynamic") {
        return <DynamicGraph />;
    } else if (choice === "fuv") { // 追加
        return <FUVGraph />;
    }

    return (
        <div>
            <div className={`${styles['container']} ${styles['backgroundImage']}`}>
                <div className={styles['Entry-Logo']}>
                    {renderRandomFile()}
                    <div className={styles['menu']}>
                        <ul>
                            <li className={styles['menu-list']}><p>StaticGraph</p></li>
                            <li className={styles['menu-list']}><p>DynamicGraph</p></li>
                            <li className={styles['menu-list']}><p>FUV</p></li>
                            <li className={styles['menu-list']}><p>Other</p></li>

                        </ul>
                    </div>
                </div>



                <div className={styles['button-container']}>
                    <button className={styles['btn']} onClick={() => setChoice('static')}>StaticGraph(Django)</button>

                    <button className={styles['btn']} onClick={() => setChoice('dynamic')}>DynamicGraph(D3.js)</button>

                    <button className={styles['btn']} onClick={() => setChoice('fuv')}>FUV</button>

                    <button className={styles['btn']} onClick={() => setChoice('fuv')}>Others</button>

                </div>




            </div>
            <div className={styles['Static']}>
                <div className={styles['Title']}>
                    <h1>Static Graph</h1>
                </div>
                <ul>
                    <div className={styles['video-container']}>
                        <li className={styles['static-list']}>Select File</li>
                        <div className={styles['video']}>
                            <video width="420" height="200" controls>
                                <source src={`${process.env.PUBLIC_URL}/images/SelectFile.mp4`} type="video/mp4" />
                                お使いのブラウザは動画タグをサポートしていません。
                            </video>
                        </div>
                        <p className={styles['video-ex']}>ファイル選択を行う際は動画のように選択してください。AWS(S3)へのアップロードに少し時間がかかるので、上部に表示されるローダーが終わるまで、次の操作をしないでください</p>
                    </div>


                    <div className={styles['video-container']}>
                        <li className={styles['static-list']}>Generate Graph</li>
                        <div className={styles['video']}>
                            <video width="420" height="200" controls>
                                <source src={`${process.env.PUBLIC_URL}/images/GenerateGraph.mp4`} type="video/mp4" />
                                お使いのブラウザは動画タグをサポートしていません。
                            </video>
                        </div>
                        <p className={styles['video-ex']}>グラフを生成するときはGenerateボタンを押してください。ローダーが開始するのでそれまで少しの間待ってください。その後他の解析を行ってください</p>
                    </div>




                    <div className={styles['video-container']}>
                        <li className={styles['static-list']}>Concentration</li>
                        <div className={styles['video']}>
                            <video width="420" height="200" controls>
                                <source src={`${process.env.PUBLIC_URL}/images/Concentration.mp4`} type="video/mp4" />
                                お使いのブラウザは動画タグをサポートしていません。
                            </video>
                        </div>
                        <p className={styles['video-ex']}>モル吸光係数のグラフを出力する際は、水の濃度を入力する必要があるので濃度に対応する計算した水の濃度を入力したのちにGenerateボタンを押してください</p>
                    </div>




                    <div className={styles['video-container']}>
                        <li className={styles['static-list']}>Download</li>
                        <div className={styles['video']}>
                            <video width="420" height="200" controls>
                                <source src={`${process.env.PUBLIC_URL}/images/Download.mp4`} type="video/mp4" />
                                お使いのブラウザは動画タグをサポートしていません。
                            </video>
                        </div>
                        <p className={styles['video-ex']}>Downloadボタンがある場合は、エクセルデータをダウンロードすることができます。ダウンロードしたデータをDynamicGraphやその他の解析に役立ててください</p>
                    </div>





                    <div className={styles['video-container']}>
                        <li className={styles['static-list']}>Derivative</li>
                        <div className={styles['video']}>
                            <video width="420" height="200" controls>
                                <source src={`${process.env.PUBLIC_URL}/images/Derivative.mp4`} type="video/mp4" />
                                お使いのブラウザは動画タグをサポートしていません。
                            </video>
                        </div>
                        <p className={styles['video-ex']}>二次微分から四次微分まで微分することができます。変更したい際はヘッダーにあるハンバーガーボタンを押すと微分を変更することができます</p>
                    </div>






                </ul>
            </div>

            <div>
                <div className={styles['Title']}>
                    <h1>Dynamic Graph</h1>
                </div>
                <ul>
                    <li className={styles['static-list']}>Plotly.js Graph</li>

                </ul>
            </div>


            <div>
                <div className={styles['Title']}>
                    <h1>FUV</h1>
                </div>
                <ul>
                    <li className={styles['static-list']}>KKTransform</li>
                    <li className={styles['static-list']}>FUVGraph</li>
                    <li className={styles['static-list']}>Second Derivative</li>
                </ul>
            </div>


            <div>
                <div className={styles['Title']}>
                    <h1>Other</h1>
                </div>
                <ul>
                    <li className={styles['static-list']}>Find Peak</li>
                    <li className={styles['static-list']}>FUVGraph</li>
                    <li className={styles['static-list']}>Second Derivative</li>
                </ul>
            </div>
        </div>
    );

}

export default EntryPage;
