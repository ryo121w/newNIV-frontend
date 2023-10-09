import './App.css';
import FileUploader from './Static/FileUploader';
import GraphComponent from './Static/GraphComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <FileUploader />
        <GraphComponent />
      </header>
    </div>
  );
}

export default App;
