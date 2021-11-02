import React from 'react';
import Score from '../types/Score';

type ScoreViewProps = {
  score: Score;
};

function ScoreView(props: ScoreViewProps) {
  const typingSpeed: number = Math.round(props.score.lettersTyped / (props.score.milliseconds / 1000) * 100) / 100;
  return (
    <div className="ScoreView">
      <div className="lettersTyped">Letters typed: {props.score.lettersTyped}</div>
      <div className="typingSpeed">Typing speed: {typingSpeed}</div>
      <div className="totalErrors">Total errors: {props.score.totalErrors}</div>
    </div>
  );
}

export default ScoreView;
