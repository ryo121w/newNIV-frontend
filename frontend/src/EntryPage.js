// EntryPage.js
import React, { useState, useEffect, useRef } from 'react';
import styles from './EntryPage.module.css'
import StaticGraph from './StaticGraph';
import DynamicGraph from './Dynamic/DynamicGraph';
import FUVGraph from './FUVGraph/FUVGraph';

function EntryPage() {
    const [choice, setChoice] = useState(null);
    const [randomFile, setRandomFile] = useState('');
    const [isPlaying, setIsPlaying] = useState({}); // 動画の再生状態を管理する state
    const videoRef = useRef({}); // videoRef をオブジェクトとして初期化




    const files = [
        '/images/NIVLogo.png',
        '/images/NIV.gif',
        '/images/NIV2.gif',
        '/images/NIV3.gif',
        '/images/NIV4.gif',
        '/images/NIV5.gif',
        '/images/NIV6.gif',
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

    const playPause = (event, videoKey) => { // videoKey を引数として追加
        event.stopPropagation();

        const currentVideo = videoRef.current[videoKey]; // videoRef をオブジェクトとして扱い、特定の動画を取得

        if (currentVideo.paused) {
            currentVideo.play();
            setIsPlaying(prevState => ({ ...prevState, [videoKey]: true }));
        } else {
            currentVideo.pause();
            setIsPlaying(prevState => ({ ...prevState, [videoKey]: false }));
        }
    };

    const [isVisible, setIsVisible] = useState({
        selectFile: false,
        generateGraph: false,
        concentration: false,
        download: false,
        derivative: false,
        // 他のビデオキーもここに追加...
    });


    const showVideo = (videoKey) => {
        setIsVisible(prevState => ({ ...prevState, [videoKey]: true }));
    };

    const hideVideo = (videoKey) => {
        setIsVisible(prevState => ({ ...prevState, [videoKey]: false }));
    };


    useEffect(() => {
        const handleScroll = () => {
            const fadeInElements = document.querySelectorAll(`.${styles['fadeInUp']}`);
            fadeInElements.forEach(element => {
                if (isElementInViewport(element) && !element.classList.contains(styles['visible'])) {
                    element.classList.add(styles['visible']);
                }
            });
        };

        const isElementInViewport = (el) => {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);






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
            <div className={styles['wrapper']}>
                <div className={styles['Static']}>
                    <div className={`${styles['Title']} ${styles['fadeInUp']}`}>
                        <h1>Static Graph</h1>
                    </div>
                    <ul>
                        <div className={`${styles['video-container']} ${styles['fadeInUp']}`}>
                            <li
                                className={`${styles['static-list']} ${styles['fadeInUp']}`}
                                onMouseEnter={() => showVideo('selectFile')}

                            >
                                Select File
                            </li>
                            <div className={`${styles['video']} ${isVisible['selectFile'] ? styles['video-visible'] : styles['video-hidden']}`}
                                onClick={(e) => playPause(e, 'selectFile')}
                                onMouseLeave={() => hideVideo('selectFile')}>
                                <video ref={el => videoRef.current['selectFile'] = el}>
                                    <source src={`${process.env.PUBLIC_URL}/images/SelectFile.mp4`} type="video/mp4" />
                                    お使いのブラウザは動画タグをサポートしていません。
                                </video>
                                {!isPlaying['selectFile'] && (
                                    <button className={styles['play-button']} onClick={(e) => playPause(e, 'selectFile')}>
                                        <img src={`${process.env.PUBLIC_URL}/images/Play.png`} alt="Play Button" />
                                    </button>
                                )}
                                <p className={styles['video-ex']}>ファイル選択を行う際は動画のように選択してください。AWS(S3)へのアップロードに少し時間がかかるので、上部に表示されるローダーが終わるまで、次の操作をしないでください</p>
                            </div>

                        </div>







                        <div className={`${styles['video-container']} ${styles['fadeInUp']}`}>

                            <li className={`${styles['static-list']} ${styles['fadeInUp']}`}
                                onMouseEnter={() => showVideo('generateGraph')}>Generate Graph</li>


                            <div className={`${styles['video']} ${isVisible['generateGraph'] ? styles['video-visible'] : styles['video-hidden']}`}
                                onClick={(e) => playPause(e, 'generateGraph')}
                                onMouseLeave={() => hideVideo('generateGraph')}>
                                <video ref={el => videoRef.current['generateGraph'] = el}>
                                    <source src={`${process.env.PUBLIC_URL}/images/GenerateGraph.mp4`} type="video/mp4" />
                                    お使いのブラウザは動画タグをサポートしていません。
                                </video>
                                {!isPlaying['generateGraph'] && (
                                    <button className={styles['play-button']} onClick={(e) => playPause(e, 'generateGraph')}>
                                        <img src={`${process.env.PUBLIC_URL}/images/Play.png`} alt="Play Button" />
                                    </button>
                                )}
                            </div>
                            <p className={styles['video-ex']}>グラフを生成するときはGenerateボタンを押してください。ローダーが開始するのでそれまで少しの間待ってください。その後他の解析を行ってください</p>
                        </div>




                        <div className={`${styles['video-container']} ${styles['fadeInUp']}`}>
                            <li className={`${styles['static-list']} ${styles['fadeInUp']}`}
                                onMouseEnter={() => showVideo('concentration')}>Concentration</li>


                            <div className={`${styles['video']} ${isVisible['concentration'] ? styles['video-visible'] : styles['video-hidden']}`}
                                onClick={(e) => playPause(e, 'concentration')}
                                onMouseLeave={() => hideVideo('concentration')}>
                                <video ref={el => videoRef.current['concentration'] = el}>
                                    <source src={`${process.env.PUBLIC_URL}/images/Concentration.mp4`} type="video/mp4" />
                                    お使いのブラウザは動画タグをサポートしていません。
                                </video>
                                {!isPlaying['concentration'] && (
                                    <button className={styles['play-button']} onClick={(e) => playPause(e, 'concentration')}>
                                        <img src={`${process.env.PUBLIC_URL}/images/Play.png`} alt="Play Button" />
                                    </button>
                                )}
                            </div>
                            <p className={styles['video-ex']}>モル吸光係数のグラフを出力する際は、水の濃度を入力する必要があるので濃度に対応する計算した水の濃度を入力したのちにGenerateボタンを押してください</p>
                        </div>

                        <div className={`${styles['video-container']} ${styles['fadeInUp']}`}>
                            <li className={`${styles['static-list']} ${styles['fadeInUp']}`}
                                onMouseEnter={() => showVideo('download')}>Download</li>


                            <div className={`${styles['video']} ${isVisible['download'] ? styles['video-visible'] : styles['video-hidden']}`}
                                onClick={(e) => playPause(e, 'download')}
                                onMouseLeave={() => hideVideo('download')}>
                                <video ref={el => videoRef.current['download'] = el}>
                                    <source src={`${process.env.PUBLIC_URL}/images/Download.mp4`} type="video/mp4" />
                                    お使いのブラウザは動画タグをサポートしていません。
                                </video>
                                {!isPlaying['download'] && (
                                    <button className={styles['play-button']} onClick={(e) => playPause(e, 'download')}>
                                        <img src={`${process.env.PUBLIC_URL}/images/Play.png`} alt="Play Button" />
                                    </button>
                                )}
                            </div>
                            <p className={styles['video-ex']}>Downloadボタンがある場合は、エクセルデータをダウンロードすることができます。ダウンロードしたデータをDynamicGraphやその他の解析に役立ててください</p>
                        </div>

                        <div className={`${styles['video-container']} ${styles['fadeInUp']}`}>
                            <li className={`${styles['static-list']} ${styles['fadeInUp']}`}
                                onMouseEnter={() => showVideo('derivative')}>Derivative</li>
                            <div className={`${styles['video']} ${isVisible['derivative'] ? styles['video-visible'] : styles['video-hidden']}`}
                                onClick={(e) => playPause(e, 'derivative')}
                                onMouseLeave={() => hideVideo('derivative')}>
                                <video ref={el => videoRef.current['derivative'] = el}>
                                    <source src={`${process.env.PUBLIC_URL}/images/Derivative.mp4`} type="video/mp4" />
                                    お使いのブラウザは動画タグをサポートしていません。
                                </video>
                                {!isPlaying['derivative'] && (
                                    <button className={styles['play-button']} onClick={(e) => playPause(e, 'derivative')}>
                                        <img src={`${process.env.PUBLIC_URL}/images/Play.png`} alt="Play Button" />
                                    </button>
                                )}
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
        </div>
    );

}

export default EntryPage;
