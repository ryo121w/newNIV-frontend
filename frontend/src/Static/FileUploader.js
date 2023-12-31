import React from 'react';
import * as XLSX from 'xlsx';
import styles from './css/FileUploader.module.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const FileUploader = ({ isLoading, setIsLoading }) => {

    const handleFileUpload = (e) => {
        setIsLoading(true);  // ローディング開始
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            fetch(`${BACKEND_URL}api/upload_excel/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    setIsLoading(false);  // ローディング終了
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setIsLoading(false);  // エラーが発生した場合もローディングを終了
                });
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div>
            <label htmlFor="fileInput" className={styles['cssbuttons-io-button']}>
                ファイルを選択
                <div className={styles.icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
                    </svg>
                </div>
            </label>
            <input id="fileInput" type="file" accept=".xlsx, .xls, .xlsm" onChange={handleFileUpload} style={{ display: 'none' }} />
        </div>
    );
};

export default FileUploader;
