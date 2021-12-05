import React from 'react';

import Score from '../types/Score';
import ScoreView from './ScoreView';

type PrevScoresSectionProps = {
  scores: Score[],
  onResetScores: () => void,
};

function PrevScoresSection(props: PrevScoresSectionProps) {
  if (props.scores.length === 0) {
    return null;
  }

  return (
    <div className="PrevScoresSection">
      <h2>Prevoius scores</h2>
      <div className="scoreViewsContainer">
        {props.scores.slice().reverse().map((score: Score) => <ScoreView score={score} key={score.id} />)}
      </div>
      <div className="buttons">
        <input type="button" value="Reset scores" onClick={props.onResetScores} />
      </div>
    </div>
  );
}

export default PrevScoresSection;
