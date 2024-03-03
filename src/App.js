import logo from './logo.svg';
import './App.css';
import FrescobolFileParser from './FrescobolParser';

function App() {
  return (
    <div className="App">
      <div className="App-header" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ textAlign: 'left', margin: 6 }}>
          <h1>
            FRESCOBOL PRO
          </h1>
          <h4>Analise gráfica de sequências de golpes</h4>
        </p>
        <img src={require('./logolira.png')} />
      </div>
      <FrescobolFileParser />

    </div>
  );
}

export default App;
