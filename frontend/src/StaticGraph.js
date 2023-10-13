import './App.css';
import React, { useState, useEffect } from 'react';
import ConcentrationGraphComponent from './Static/ConcentrationGraphComponent';
import DifferentialComponent from './Static/Derivative/DifferentialComponent';
import DifferentialRadioButtons from './Static/Derivative/DifferentialRadioButtons'
import FileUploader from './Static/FileUploader';
import GraphComponent from './Static/GraphComponent';
import DifferenceGraphComponent from './Static/DifferenceGraphComponent';
import PrincipalComponentAnalysis from './Static/PrincipalComponentAnalysis';


function StaticGraph() {
  const [selectedDifferential, setSelectedDifferential] = useState("ONE");


  const handleChange = (event) => {
    setSelectedDifferential(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <FileUploader />
        <GraphComponent />
        <ConcentrationGraphComponent />

        <div className="component-wrapper" id="Differential">
          <DifferentialComponent className="SecondDerivativeGraphComponent" selectedDifferential={selectedDifferential} />
        </div>

        <DifferentialRadioButtons
          selectedDifferential={selectedDifferential}
          handleChange={handleChange}
        />

        <DifferenceGraphComponent />

        <PrincipalComponentAnalysis />
      </header>
    </div>
  );
}

export default StaticGraph;
