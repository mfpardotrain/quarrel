import './App.css';
import Keyboard from './Keyboard';
import { GuessContextWrapper } from './GuessContext';
import Display from './Display';

function App() {
  return (
    <div className="App">
      <h1 className="app-header">
        quarrel
      </h1>

      <GuessContextWrapper>
          <Display />
          <Keyboard />
      </GuessContextWrapper>

    </div>
  );
}

export default App;
