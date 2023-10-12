import React, { useEffect, useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import styles from '../css/GoogleChart.module.css';
import dynamicButtonStyles from '../css/DynamicButton.module.css';


const GoogleChartExample = () => {
  const [data, setData] = useState([]);
  const [isZoomMode, setIsZoomMode] = useState(true); // 初期値はズームモード
  const inputRef = useRef(null);
  useEffect(() => {
    if (window.google) {
      window.google.charts.load('current', { packages: ['corechart'] });
      window.google.charts.setOnLoadCallback(() => {
        drawChart(data);
      });
    }
  }, [data, isZoomMode]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const parsedData = XLSX.utils.sheet_to_json(ws, { header: 1 });

      setData(parsedData);
    };
    reader.readAsBinaryString(file);
  };

  const drawChart = (chartData) => {
    if (!chartData || !chartData.length || !chartData[0]) {
      return;
    }

    const dataTable = new window.google.visualization.DataTable();
    chartData[0].forEach((label) => {
      dataTable.addColumn('number', label);
    });

    dataTable.addRows(chartData.slice(1));

    const options = {
      title: 'Dynamic Spectrum Data',
      hAxis: {
        title: 'Wave number (cm-1)',
        direction: -1,
        gridlines: { color: 'transparent' }
      },
      vAxis: {
        title: 'Intensity',
        gridlines: { color: 'transparent' }
      },
      explorer: isZoomMode ? {
        actions: ['dragToZoom', 'rightClickToReset'],
        axis: 'horizontal',
        keepInBounds: true,
        maxZoomIn: 4.0
      } : {
        actions: ['dragToPan', 'rightClickToReset'],
        axis: 'horizontal'
      }
    };

    const chart = new window.google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(dataTable, options);
  };

  const triggerInputClick = () => {
    inputRef.current.click();
  };

  return (
    <div className={styles['content-wrapper']}>
      <h2 className={styles['Google-Title']}>Google Charts </h2>

      <input
        type="file"
        accept=".csv,.xlsx,.xlsm"
        onChange={handleFileChange}
        ref={inputRef}
        style={{ display: 'none' }}
      />


      <button onClick={triggerInputClick} className={dynamicButtonStyles.button}>
        <span>Select File</span>
        <svg width="34" height="34" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="37" cy="37" r="35.5" stroke="black" stroke-width="3"></circle>
          <path d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z" fill="black"></path>
        </svg>
      </button>
      <button onClick={() => setIsZoomMode(!isZoomMode)} className={dynamicButtonStyles.button}>Toggle Zoom/Pan</button> {/* ボタンを追加 */}
      <div id="chart_div" style={{ width: '600px', height: '400px' }}></div>
    </div>
  );
};

export default GoogleChartExample;
