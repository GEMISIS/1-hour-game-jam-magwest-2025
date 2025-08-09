import { useState } from 'react';
import character from './character.svg';
import './App.css';

function App() {
  const [bouncing, setBouncing] = useState(false);

  const handleClick = () => {
    setBouncing(true);
  };

  return (
    <div className="App">
      <div id="game-container">
        <img
          src={character}
          alt="character"
          className={`character ${bouncing ? 'bounce' : ''}`}
          onClick={handleClick}
          onAnimationEnd={() => setBouncing(false)}
        />
      </div>
    </div>
  );
}

export default App;
