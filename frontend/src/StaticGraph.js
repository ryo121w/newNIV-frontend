import './App.css';
import ConcentrationGraphComponent from './Static/ConcentrationGraphComponent';
import FileUploader from './Static/FileUploader';
import GraphComponent from './Static/GraphComponent';

function StaticGraph() {
  return (
    <div className="App">
      <header className="App-header">
        <FileUploader />
        <GraphComponent />
        <ConcentrationGraphComponent />
      </header>
    </div>
  );
}

export default StaticGraph;
