import './App.css';
import { GuessContextWrapper } from './GuessContext';
import Pages from './Pages';

function App() {
  return (
    <div className="App">
      <h1 className="app-header">
        quarrel
      </h1>


      <GuessContextWrapper>
        <Pages />
      </GuessContextWrapper>

    </div>
  );
}

export default App;
