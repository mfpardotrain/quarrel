import './App.css';
import { GuessContextWrapper } from './GuessContext';
import Pages from './Pages';

function App() {
  return (
    <div className="App">
      <h1 className="app-header">
        <div className='css-logo'>
          <div className='logo-letter letter-green'>Q</div>
          <div className='logo-letter letter-green'>U</div>
          <div className='logo-letter letter-grey'>A</div>
          <div className='logo-letter letter-yellow'>R</div>
          <div className='logo-letter letter-green'>R</div>
          <div className='logo-letter letter-grey'>E</div>
          <div className='logo-letter letter-grey'>L</div>
        </div>
      </h1>

      <GuessContextWrapper>
        <Pages />
      </GuessContextWrapper>
    </div>
  );
}

export default App;
