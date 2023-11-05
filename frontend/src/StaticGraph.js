import './App.css';
import React, { useState, useEffect } from 'react';
import ConcentrationGraphComponent from './Static/ConcentrationGraphComponent';
import DifferentialComponent from './Static/Derivative/DifferentialComponent';
import DifferentialRadioButtons from './Static/Derivative/DifferentialRadioButtons'
import FileUploader from './Static/FileUploader';
import GraphComponent from './Static/GraphComponent';
import DifferenceGraphComponent from './Static/DifferenceGraphComponent';
import PrincipalComponentAnalysis from './Static/PrincipalComponentAnalysis';
import MultipleCorrespondenceAnalysis from './Static/MultipleCorrespondenceAnalysis';
import styles from './Static.module.css';
import LinearProgress from './LinearProgress';
import { BrowserRouter as Router } from 'react-router-dom';
import NavigationBar from './NavigationBar';

function StaticGraph() {
  const [selectedDifferential, setSelectedDifferential] = useState("ONE");
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);


  const handleChange = (event) => {
    setSelectedDifferential(event.target.value);
  };

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 100) {  // 200px以上スクロールしたら
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };



  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  let navbarClasses = styles['App-Logo'];  // CSS Moduleを使用して初期値を設定

  if (scrolled) {
    navbarClasses = `${navbarClasses} ${styles.scrolled}`;  // スクロール時のクラスもCSS Moduleから取得
  }


  const toggleActive = () => {
    setIsActive(!isActive);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };




  return (
    <div className="App">
      <header className="App-header">
        <div className={navbarClasses}>
          {isLoading && <LinearProgress />} {/* isLoadingがtrueのときにLinearProgressを表示 */}
          <ul>
            <li><p><NavigationBar /></p></li>
            <li><p onClick={() => scrollTo('GraphComponent')}>NIR Graph</p></li>
            <li><p onClick={() => scrollTo('ConcentrationGraphComponent')}>Concentration Graph</p></li>
            <li><p onClick={() => scrollTo('Differential')}>Differential</p></li>
            <li><p onClick={() => scrollTo('DifferenceGraphComponent')}>Difference</p></li>
            <li><p onClick={() => scrollTo('PrincipalComponentAnalysis')}>PCA</p></li>
            <li><p onClick={() => scrollTo('MultipleCorrespondenceAnalysis')}>MCA</p></li>
            <li><div className={`openbtn6 ${isActive ? 'active' : ''}`} onClick={() => { toggleActive(); toggleSidebar(); }}><span></span><span></span><span></span></div></li>
          </ul>
        </div>

        {/* サイドバー */}
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <DifferentialRadioButtons
            selectedDifferential={selectedDifferential}
            handleChange={handleChange}
          />
        </div>




        <FileUploader isLoading={isLoading} setIsLoading={setIsLoading} />

        <div id="GraphComponent" className={styles['wrapper']}>
          <GraphComponent />
        </div>

        <div id="ConcentrationGraphComponent" className={styles['wrapper']}>
          <ConcentrationGraphComponent isLoading={isLoading} setIsLoading={setIsLoading} />
        </div>

        <div className={styles['wrapper']} id="Differential" >
          <DifferentialComponent className="SecondDerivativeGraphComponent" selectedDifferential={selectedDifferential} setIsLoading={setIsLoading} />
        </div>

        <div id="DifferenceGraphComponent" className={styles['wrapper']}>
          <DifferenceGraphComponent isLoading={isLoading} setIsLoading={setIsLoading} />
        </div>

        <div id="PrincipalComponentAnalysis" className={styles['wrapper']}>
          <PrincipalComponentAnalysis isLoading={isLoading} setIsLoading={setIsLoading} />
        </div>

        <div id="MultipleCorrespondenceAnalysis" className={styles['wrapper']}>
          <MultipleCorrespondenceAnalysis isLoading={isLoading} setIsLoading={setIsLoading} />
        </div>
      </header>
    </div>
  );
}

export default StaticGraph;
