import React from 'react';
import Score from '../types/Score';

type ScoreViewProps = {
  score: Score;
};

function ScoreView(props: ScoreViewProps) {
  const lettersTyped: number = Math.round(props.score.lettersTyped);
  const typingSpeed: number = Math.round(props.score.lettersTyped / (props.score.milliseconds / 1000) * 100) / 100;
  const totalErrors: number = Math.round(props.score.totalErrors);
  return (
    <div className="ScoreView">
      <div className="lettersTyped">Letters typed: {lettersTyped}</div>
      <div className="typingSpeed">Typing speed: {typingSpeed}</div>
      <div className="totalErrors">Errors made: {totalErrors}</div>
    </div>
  );
}

export default ScoreView;
