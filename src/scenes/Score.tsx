import React from 'react';

interface Props {
  score: number;
  onPlayAgain: () => void;
  onViewHighScores: () => void;
}

export const Score: React.FC<Props> = ({ score, onPlayAgain, onViewHighScores }) => (
  <div className="menu score-screen">
    <h2>Score</h2>
    <p>${score.toLocaleString()}</p>
    <button onClick={onPlayAgain}>Play Again</button>
    <button onClick={onViewHighScores}>High Scores</button>
  </div>
);
