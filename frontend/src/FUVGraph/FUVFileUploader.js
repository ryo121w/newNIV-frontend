import React from 'react';
import * as XLSX from 'xlsx';
import styles from './css/FileUploader.module.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const FileUploader = () => {

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // ファイルのデータを処理
            const firstRow = jsonData[0];
            const concentrations = Object.keys(firstRow).filter(key => key !== '波長');

            // データをバックエンドに送信
            fetch(`${BACKEND_URL}api/fuv_upload/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        };

        reader.readAsArrayBuffer(file);
    };

    const handleNireFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // データをバックエンドに送信
            fetch(`${BACKEND_URL}api/nire_upload/`, { // URLを変更
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div>
            <label htmlFor="fuvFileInput" className={styles['cssbuttons-io-button']}>
                ファイルを選択 (FUV)
                <div className={styles.icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
                    </svg>
                </div>
            </label>
            <input id="fuvFileInput" type="file" accept=".xlsx, .xls, .xlsm" onChange={handleFileUpload} style={{ display: 'none' }} />

            <label htmlFor="nireFileInput" className={styles['cssbuttons-io-button']}>
                ファイルを選択 (Nire)
                <div className={styles.icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
                    </svg>
                </div>
            </label>
            <input id="nireFileInput" type="file" accept=".xlsx, .xls, .xlsm" onChange={handleNireFileUpload} style={{ display: 'none' }} />

        </div>
    );
};

export default FileUploader;

